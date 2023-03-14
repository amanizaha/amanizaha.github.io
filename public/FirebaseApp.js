// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9wQY6bCkr1mUgWxATGNnwSwOSs9JXkb4",
  authDomain: "thesis-11cc1.firebaseapp.com",
  projectId: "thesis-11cc1",
  storageBucket: "thesis-11cc1.appspot.com",
  messagingSenderId: "118723468214",
  appId: "1:118723468214:web:914ba2588d74c80a90bf17",
  measurementId: "G-RDE3Q38VC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("hey")