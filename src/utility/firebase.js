import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  query,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const pageSize = 10;

export class FirebaseInit {
  // TODO: Replace the following with your app's Firebase project configuration
  firebaseConfig = {
    apiKey: "AIzaSyDw6zS7MEkaO1uWvIRr44JfAuswjMGOfZE",
    authDomain: "cablelocatorwithalex-d48ff.firebaseapp.com",
    projectId: "cablelocatorwithalex-d48ff",
    storageBucket: "cablelocatorwithalex-d48ff.appspot.com",
    messagingSenderId: "36490701913",
    appId: "1:36490701913:web:f0bb0256cf9e0e6e375548",
    measurementId: "G-RRWZS61GQ2",
  };
  #app = null;
  #auth = null;
  #storage = null;
  #db = null;
  #currentUser = null;

  constructor() {
    try {
      this.#app = initializeApp(this.firebaseConfig);
      this.#auth = getAuth(this.#app);
      this.#db = getFirestore(this.#app);
      this.#storage = getStorage(this.#app);

      if (location.hostname === "localhost") {
        connectAuthEmulator(this.#auth, "http://localhost:9099");
        connectFirestoreEmulator(this.#db, "localhost", 8080);
        connectStorageEmulator(this.#storage, "localhost", 9199);
      }
    } catch (e) {
      console.log("error on firebase init");
    }
  }

  get getCurrentuser() {
    return this.#currentUser;
  }
  get getDb() {
    return this.#db;
  }

  get getStorage() {
    return this.#storage;
  }

  get operators() {
    return ["=="];
  }

  async signUp(email, password) {
    return createUserWithEmailAndPassword(this.#auth, email, password)
      .then((result) => {
        this.#currentUser = result;
        return this.#currentUser;
      })
      .catch((error) => {
        throw new HttpError(error);
      });
  }

  async signIn(email, password) {
    return signInWithEmailAndPassword(this.#auth, email, password)
      .then((result) => {
        this.#currentUser = result.user;
        return this.#currentUser;
      })
      .catch((error) => {
        throw new HttpError(error);
      });
  }

  signOut() {
    this.#auth.signOut();
  }

  onFirstData(collectionName, filters = []) {
    let quoteCollection = collection(this.#db, collectionName);
    let baseFilter = [limit(pageSize)];
    baseFilter = [...filters, ...baseFilter];
    let myQuery = query(quoteCollection, ...baseFilter);
    return getDocs(myQuery);
  }

  onNextData(collectionName, firstDoc, lastDoc, filters = []) {
    if (!firstDoc || !lastDoc) {
      console.log("Can't navigate yet");
    } else {
      let quoteCollection = collection(this.#db, collectionName);
      let baseFilter = [startAfter(lastDoc), limit(pageSize)];
      baseFilter = [...filters, ...baseFilter];

      let myQuery = query(quoteCollection, ...baseFilter);
      return getDocs(myQuery);
    }
  }

  onPrevData(collectionName, firstDoc, lastDoc, filters = []) {
    if (!firstDoc || !lastDoc) {
      console.log("Can't navigate yet");
    } else {
      let quoteCollection = collection(this.#db, collectionName);
      let baseFilter = [endBefore(firstDoc)];
      baseFilter = [...filters, ...baseFilter];
      let myQuery = query(
        quoteCollection,
        ...baseFilter,
        limitToLast(pageSize)
      );
      return getDocs(myQuery);
    }
  }

  onUpdate(collectionName, docId, updateObj) {
    let docRef = doc(this.#db, collectionName, docId);
    return updateDoc(docRef, updateObj);
  }

  async setDocument(collectionName, value) {
    const ref = collection(this.#db, collectionName);
    return setDoc(doc(ref), value);
  }

  async watchUser(callback) {
    onAuthStateChanged(this.#auth, (user) => {
      this.#currentUser = user ? user : null;
      callback(user ? true : false);
    });
  }
}
class HttpError extends Error {
  constructor(error) {
    super();
    this.code = error.code;
    this.message = error.message;
  }
}
