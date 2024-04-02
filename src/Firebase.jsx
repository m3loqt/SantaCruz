// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOW8-bsgmp1NWhlj65Kc_URybr4UDmMRg",
  authDomain: "santacruz-16ea3.firebaseapp.com",
  databaseURL: "https://santacruz-16ea3-default-rtdb.firebaseio.com",
  projectId: "santacruz-16ea3",
  storageBucket: "santacruz-16ea3.appspot.com",
  messagingSenderId: "1061941671287",
  appId: "1:1061941671287:web:368d7ee5d627e6f5bedd72",
  measurementId: "G-3K05JNQ0K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storageBucket = getStorage(app);