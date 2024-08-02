// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgW7JFRk68uEiSA9iPDF573ThUEhw3Sao",
  authDomain: "inventory-tracker-65c9b.firebaseapp.com",
  projectId: "inventory-tracker-65c9b",
  storageBucket: "inventory-tracker-65c9b.appspot.com",
  messagingSenderId: "75158093014",
  appId: "1:75158093014:web:08ae20e1cb3565044f1d77",
  measurementId: "G-3SYM1WN7ZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
