// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBKC8c0pKLsdovstNRUCr2Dpw0NQWnmic",
  authDomain: "real-estate-staff-app.firebaseapp.com",
  projectId: "real-estate-staff-app",
  storageBucket: "real-estate-staff-app.firebasestorage.app",
  messagingSenderId: "479042139674",
  appId: "1:479042139674:web:fbbd20d4e2874f0c3643a3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
