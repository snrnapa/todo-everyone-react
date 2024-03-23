// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBNUsLtzxoXBkk-zvxTgRjKK7HiHUI0Y1M',
  authDomain: 'todo-everyone.firebaseapp.com',
  projectId: 'todo-everyone',
  storageBucket: 'todo-everyone.appspot.com',
  messagingSenderId: '175881957140',
  appId: '1:175881957140:web:be0fea211390a74256dc01',
  measurementId: 'G-BWWD5BDJKM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
