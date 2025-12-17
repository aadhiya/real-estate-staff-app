// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your key",
  authDomain: "real-estate-staff-app.firebaseapp.com",
  projectId: "real-estate-staff-app",
  storageBucket: "real-estate-staff-app.firebasestorage.app",
  messagingSenderId: "",
  appId: ""
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
