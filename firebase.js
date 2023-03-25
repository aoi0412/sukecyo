// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoORcO0GTGh4n2fH8DJhVNrZhG6OpPerY",
  authDomain: "sukecyo.firebaseapp.com",
  projectId: "sukecyo",
  storageBucket: "sukecyo.appspot.com",
  messagingSenderId: "498746188475",
  appId: "1:498746188475:web:41fea54cf78be6a5293f9e",
  measurementId: "G-1KW3NJHS59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);