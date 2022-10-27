import { where, orderBy } from "firebase/firestore";
import { FirebaseInit } from "./firebase";

export default class QuoteService {
  #firebaseInstance = null;
  defField = ["username", "email", "message", "resolve", "timestamp"];
  collectionName = "quote";

  filter = [];
  firstDoc = null;
  lastDoc = null;

  constructor(myfirebaseInstance) {
    if (!myfirebaseInstance instanceof FirebaseInit) {
      throw new Error("Cant instantiate firebase");
    }
    this.#firebaseInstance = myfirebaseInstance;
  }

  #getFilters(rawFilterArray) {
    let final = [];
    let containTimestamp = false;
    for (let rfa of rawFilterArray) {
      final.push(where(rfa.field, rfa.operator, rfa.value));
      containTimestamp = (rfa.field == 'timestamp');
    }
    //if(!containTimestamp) {
      final.push( orderBy('timestamp','desc'));
    //}
    return final;
  }

  async onFirstData(rawfilterArray) {
    this.filter = this.#getFilters(rawfilterArray);
    const snapshot = await this.#firebaseInstance.onFirstData(
      this.collectionName,
      this.filter
    );
    this.firstDoc = snapshot.docs[0];
    this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return snapshot;
  }

  async onPrevData() {
    const snapshot = await this.#firebaseInstance.onPrevData(
      this.collectionName,
      this.firstDoc,
      this.lastDoc,
      this.filter
    );
    if (!snapshot || snapshot.docs.length == 0) {
      return null;
    } else {
      this.firstDoc = snapshot.docs[0];
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
      return snapshot;
    }
  }

  async onNextData() {
    const snapshot = await this.#firebaseInstance.onNextData(
      this.collectionName,
      this.firstDoc,
      this.lastDoc,
      this.filter
    );
    if (!snapshot || snapshot.docs.length == 0) {
      return null;
    } else {
      this.firstDoc = snapshot.docs[0];
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
      return snapshot;
    }
  }

  async onUpdate(docId,updateObject){
    return this.#firebaseInstance.onUpdate(this.collectionName,docId,updateObject);
  }
}
