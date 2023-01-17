// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjSC2CML7hNIB4dyu5gAl0QFtbGLD1ztw",
  authDomain: "better-twitter-3a946.firebaseapp.com",
  projectId: "better-twitter-3a946",
  storageBucket: "better-twitter-3a946.appspot.com",
  messagingSenderId: "1021128124587",
  appId: "1:1021128124587:web:7c6fbce12e1c47910eafee"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
