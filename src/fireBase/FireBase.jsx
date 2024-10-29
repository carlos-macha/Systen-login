import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3UQ9y__ObXWL2PPuU8swTVmYH9_TX3No",
  authDomain: "teste-acc96.firebaseapp.com",
  projectId: "teste-acc96",
  storageBucket: "teste-acc96.appspot.com",
  messagingSenderId: "828893737539",
  appId: "1:828893737539:web:1bdab6370ffdf95d41daf6",
  measurementId: "G-2DB16YNL42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { auth, analytics, db }
