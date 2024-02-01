// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN93MTDjXqCFiQvB_9bN0HO3VmofG3SyA",
  authDomain: "expense-tracker-605fb.firebaseapp.com",
  projectId: "expense-tracker-605fb",
  storageBucket: "expense-tracker-605fb.appspot.com",
  messagingSenderId: "846933995170",
  appId: "1:846933995170:web:ff132d86c703783eacf1fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
