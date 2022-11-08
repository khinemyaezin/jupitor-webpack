import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
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

  uploadFile(file, path) {
    const storageRef = ref(this.#firebase.getStorage, path);
    if (!file.startsWith("http")) {
      return uploadString(storageRef, file, "data_url");
    } else {
      return new Promise((res, rej) => res(file));
    }
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
