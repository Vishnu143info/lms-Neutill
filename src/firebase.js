// src/firebase/config.js

// Core Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firestore
import {
    getFirestore,
    collection,
    addDoc,
    setDoc, 
    deleteDoc,
    doc,
    query,
    onSnapshot,
    orderBy,
    getDoc, // Added getDoc for AuthContext
} from "firebase/firestore";

// Firebase Storage
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";


const firebaseConfig = {
    // 💡 IMPORTANT: Replace with YOUR actual Firebase project configuration keys
    apiKey: "AIzaSyD4sREYsVBUMKNpY8cNd3tRfsai3o1d9zE",
    authDomain: "neutill-3eb1f.firebaseapp.com",
    projectId: "neutill-3eb1f",
    storageBucket: "neutill-3eb1f.firebasestorage.app", 

    messagingSenderId: "139766387798",
    appId: "1:139766387798:web:10e359a064876c7e28d7f7",
    measurementId: "G-FWQLEC17Q0",
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize and export core services
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);


// 3. Export core app instance and analytics
export { app, analytics };

// 4. Export all necessary Firestore helpers
export {
    collection, addDoc, setDoc, deleteDoc, doc, query, onSnapshot, orderBy, getDoc,
};

// 5. Export all necessary Storage helpers
export {
    ref, uploadBytesResumable, getDownloadURL, deleteObject,
};