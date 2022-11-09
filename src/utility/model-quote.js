import { Timestamp } from "firebase/firestore";

export class Quote {
  /**
   *
   * @param {string} username
   * @param { string } email
   * @param { string } message
   * @param { string } resolve
   * @param { string } attachment
   */
  constructor(username, email, message, resolve, attachment) {
    this.docId = null;
    this.email = email;
    this.message = message;
    this.username = username;
    this.timestamp = Timestamp.fromDate(new Date());
    this.resolve = resolve;
    this.attachment = (attachment == null || attachment == 'undefined') ? '' : attachment;
  }

  get convert() {
    return {
      email: this.email,
      username: this.username,
      message: this.message,
      timestamp: this.timestamp,
      resolve: this.resolve,
      attachment: this.attachment,
    };
  }
}
