import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { FirebaseInit } from "./firebase";

export default class StorageQuery {
  #firebase = null;
  constructor(firebaseInitRef) {
    if (!firebaseInitRef instanceof FirebaseInit) {
      throw new Error("Invalid instance firebaseInit");
    }
    this.#firebase = firebaseInitRef;
  }

  getList() {
    listAll(ref(this.#firebase.getStorage))
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          console.log(folderRef);
        });
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          console.log(itemRef.name, itemRef.fullPath);
        });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  }

  /**
   *
   * @param {string} file
   * @param {string} path
   * @returns
   */
  uploadBase64(file, path) {
    const storageRef = ref(this.#firebase.getStorage, path);
    if (!file.startsWith("http")) {
      return uploadString(storageRef, file, "data_url");
    } else {
      return new Promise((res, rej) => res(file));
    }
  }
  /**
   *
   * @param {File} file
   * @param {string} path
   * @returns { Promise<string>}
   */
  uploadFile(file, path) {
    const storageRef = ref(this.#firebase.getStorage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    return new Promise((rs, rj) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          rj(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            rs(downloadURL);
          });
        }
      );
    });
  }

  /**
   *
   * @param { object | string } ref
   */
  getURL(ref) {
    if (typeof ref === "string") {
      return new Promise((r, j) => r(ref));
    }
    return getDownloadURL(ref.ref);
  }
}
