// 1️ Firebase init
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
//} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// import { auth } from "./firebase.js";
// import { auth, db } from "../firebaseConfig.js"; // 🔗 Firebase config
// Firebase Web SDK Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.appspot.com",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

// ---------------------------

// 2️ UI Panel toggles (login/register switch)
const container = document.getElementById("container");
document.getElementById("goRegister").onclick = () =>
  container.classList.add("right-panel-active");
document.getElementById("goLogin").onclick = () =>
  container.classList.remove("right-panel-active");

// 3️ Register: set approved=false for teachers + send verification email
// 3️ Password strength check
function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password);
}

// 4️ Register user
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("loader").style.display = "block"; // 🟡 show loader

    const email = e.target.regEmail.value;
    const pass = e.target.regPassword.value;
    const username = e.target.regUsername.value;
    const role = e.target.regRole.value;

    if (!isStrongPassword(pass)) {
      alert(
        "⚠️ Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
        "orange"
      );
      document.getElementById("loader").style.display = "none"; // 🔴 hide loader
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        username,
        email,
        role,
        approved: role === "teacher" ? false : true,
        createdAt: new Date(),
        emailVerified: false,
        locale: navigator.language || "en-IN",
      });

      // 🔐 Send email verification
      await sendEmailVerification(cred.user);
      alert(
        role === "teacher"
          ? "Registered! Verify your email & wait for admin approval."
          : "Registered! Please verify your email before logging in.",
        "green"
      );

      // 🔐 Log out immediately after sending email
      await signOut(auth); // Auto logout
      container.classList.remove("right-panel-active");
    } catch (err) {
      // alert(err.message);
      showMessage(err.message, "red");
    }

    document.getElementById("loader").style.display = "none"; // 🔴 hide loader
  });

// 5 Login: check verification + role + approval
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("loader").style.display = "block"; // 🟡 show loader
  const email = e.target.loginEmail.value;
  const pass = e.target.loginPassword.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    // 🔐 Check if email is verified
    if (!cred.user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.", "orange");
      document.getElementById("loader").style.display = "none"; // 🔴 hide loader
      await signOut(auth);
      return;
    }

    // const uid = cred.user.uid;
    // const snap = await getDoc(doc(db, "users", uid));
    // if (!snap.exists()) throw new Error("No profile found.");

    const { role, approved } = snap.data();

    // Admin shortcut
    if (role === "admin") {
      window.location.href = "admin.html";
      return;
    }

    // — Everyone else —
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) return; // don't proceed if email not verified
        const uid = user.uid;
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) throw new Error("No profile found.");
        const { role, approved } = snap.data();
        console.log("Logged in as:", role);

        // Save Last Login Timestamp
        await updateDoc(doc(db, "users", uid), {
          lastLogin: new Date(),
        });

        // Teacher approval check
        if (role === "teacher" && !approved) {
          alert("⏳ Your account is pending admin approval.");
          document.getElementById("loader").style.display = "none"; // 🔴 hide loader
          await signOut(auth);
          return;
        }

        // Auto-redirect to dashboard based on role
        if (window.location.pathname === "/index.html") {
          if (role === "teacher") {
            window.location.href = "../profDashboard/professorDashboard.html";
          } else if (role === "student") {
            window.location.href = "../studDashboard/studentDashboard.html";
          } else {
            alert("Unknown role.");
          }
        }
      }
    });
  } catch (err) {
    showMessage(err.message, "red");
  }

  document.getElementById("loader").style.display = "none"; // 🔴 hide loader
});
