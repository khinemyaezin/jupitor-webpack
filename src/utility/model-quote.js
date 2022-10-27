import { Timestamp } from "firebase/firestore";

export class Quote {
  constructor(username, email, message, resolve) {
    this.docId = null;
    this.email = email;
    this.message = message;
    this.username = username;
    this.timestamp = Timestamp.fromDate(new Date());
    this.resolve = resolve;
  }

  get convert() {
    return {
      email: this.email,
      username: this.username,
      message: this.message,
      timestamp: this.timestamp,
      resolve: this.resolve,
    };
  }
}
