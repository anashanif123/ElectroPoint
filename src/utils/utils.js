import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYuuR1zUBW53Doumw6zkFI5ZMXXU03JTk",
  authDomain: "learning-website-92358.firebaseapp.com",
  projectId: "learning-website-92358",
  storageBucket: "learning-website-92358.appspot.com",
  messagingSenderId: "269788669396",
  appId: "1:269788669396:web:85bf2bd6e184bb67836241",
  measurementId: "G-0DQ1MNKDSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);


export {
    auth,
    db,
    storage 
}