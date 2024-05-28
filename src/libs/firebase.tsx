import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

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
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
