// Import Firebase core and required services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBPc_rkY_RKIoEk91mHD2ulkCQpqLv3m2U",
  authDomain: "proctor-92afc.firebaseapp.com",
  projectId: "proctor-92afc",
  storageBucket: "proctor-92afc.firebasestorage.app",
  messagingSenderId: "241015750718",
  appId: "1:241015750718:web:473382a019e349cad9516f",
  measurementId: "G-SCZ7G5701B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
