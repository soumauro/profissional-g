
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAB5ciInfdiok1Lrd5Ty_Ry1K-JyfSrA0",
  authDomain: "profissional-g.firebaseapp.com",
  projectId: "profissional-g",
  storageBucket: "profissional-g.firebasestorage.app",
  messagingSenderId: "223038004241",
  appId: "1:223038004241:web:0894f5777df131e108a5b0",
  measurementId: "G-WQLX0J8NXP"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export  {firestore, auth, storage}