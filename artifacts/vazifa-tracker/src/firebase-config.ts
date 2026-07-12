
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz9OsBuT0IgXXt5RFfKLciUna0ywKPPwA",
  authDomain: "site-statika-msrfteam.firebaseapp.com",
  databaseURL: "https://site-statika-msrfteam-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "site-statika-msrfteam",
  storageBucket: "site-statika-msrfteam.appspot.com", // XATO TO'G'RILANDI
  messagingSenderId: "194534478579",
  appId: "1:194534478579:web:51a17c6457b6a0881b5d86",
  measurementId: "G-T5K022TLY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
