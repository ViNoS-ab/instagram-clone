/* eslint-disable import/first */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDmJnZKuVX84HjY385UCrmx6eWZEmgC3I",
  authDomain: "instgram-clone-ddc87.firebaseapp.com",
  databaseURL: "https://instgram-clone-ddc87.firebaseio.com",
  projectId: "instgram-clone-ddc87",
  storageBucket: "instgram-clone-ddc87.appspot.com",
  messagingSenderId: "298514028611",
  appId: "1:298514028611:web:476601f79cc39471c11cf6",
  measurementId: "G-F0VCYKW5E7",
};

import firebase from "firebase";

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const storage = firebaseApp.storage();
const auth = firebaseApp.auth();

export { db, storage, auth, firebase };
