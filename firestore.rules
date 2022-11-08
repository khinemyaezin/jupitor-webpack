rules_version = '2';
service cloud.firestore {
  match /databases / {database}/documents {
  	match /quote/{quoteId} {
      allow read, update, delete: if request.auth != null;
    }
    match /page/{quoteId}  {
    	allow read,write,delete;
    }
    match /{document=**} {
    	allow write;
    }
  }
}