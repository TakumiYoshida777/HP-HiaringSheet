import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB2LjwXig_NeIWzW4coYOCq_aZDysECEJA",
    authDomain: "hp-hearing-sheet.firebaseapp.com",
    projectId: "hp-hearing-sheet",
    storageBucket: "hp-hearing-sheet.appspot.com",
    messagingSenderId: "69618823115",
    appId: "1:69618823115:web:d61cee109ee7716edc104e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };