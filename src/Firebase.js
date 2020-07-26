import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDh0EBv-LZQ37l37YZb00GVMCGmXKdhOhA",
    authDomain: "insta-clone-9e7d3.firebaseapp.com",
    databaseURL: "https://insta-clone-9e7d3.firebaseio.com",
    projectId: "insta-clone-9e7d3",
    storageBucket: "insta-clone-9e7d3.appspot.com",
    messagingSenderId: "399470907280",
    appId: "1:399470907280:web:7d5ffb362d061171f8ad15",
    measurementId: "G-NV8ZJF6GS1"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
  
export {db, auth, storage};
