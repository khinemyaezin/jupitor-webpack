import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
} from "firebase/firestore";
// const {
//   initializeAppCheck,
//   ReCaptchaV3Provider,
// } = require("firebase/app-check");

import { Quote } from "./model-quote";

const pageSize = 10;

export class FirebaseInit {
  // TODO: Replace the following with your app's Firebase project configuration
  firebaseConfig = {
    apiKey: "AIzaSyCDkEotyALyyS3B8UU7KPrSKcQXjbdsTKQ",
    authDomain: "jupitor2-webpack.firebaseapp.com",
    projectId: "jupitor2-webpack",
    storageBucket: "jupitor2-webpack.appspot.com",
    messagingSenderId: "911670423800",
    appId: "1:911670423800:web:ef40f37b4f33130015cb0d",
    measurementId: "G-V4ZFBQ55HF",
  };
  #app = null;
  #auth = null;
  #appcheck = null;
  #db = null;
  #currentUser = null;

  constructor() {
    this.#app = initializeApp(this.firebaseConfig);
    this.#auth = getAuth(this.#app);
    this.#db = getFirestore(this.#app);

    // this.#appcheck = initializeAppCheck(this.#app, {
    //   provider: new ReCaptchaV3Provider(
    //     "6Lczxb0iAAAAALnYCEJFEj6vNq2EViFO7ZBdCebo"
    //   ),
    //   isTokenAutoRefreshEnabled: true,
    // });
  }

  get getCurrentuser() {
    return this.#currentUser;
  }
  get getDb() {
    return this.#db;
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

  async setDocument(value) {
    if (!value instanceof Quote) {
      throw new Error("value must be quote object");
    }
    const quoteRef = collection(this.#db, "quote");

    return setDoc(doc(quoteRef), value.convert);
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
