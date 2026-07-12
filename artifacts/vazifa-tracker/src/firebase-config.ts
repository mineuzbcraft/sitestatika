import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZGICJb6PhiYbnANbJiTC7eh66n1JnXDU",
  authDomain: "studio-6246725542-7426f.firebaseapp.com",
  projectId: "studio-6246725542-7426f",
  storageBucket: "studio-6246725542-7426f.firebasestorage.app",
  messagingSenderId: "661422966478",
  appId: "1:661422966478:web:c3080ed61a16e806e4f29f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
export const db = getFirestore(app);

// Get an Auth instance
export const auth = getAuth(app);
