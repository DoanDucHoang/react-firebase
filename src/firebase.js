// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyApxOvd_C-zB0ck7n-qS_jGE98IB-KE8Fc',
  authDomain: 'todo-app-93d1f.firebaseapp.com',
  projectId: 'todo-app-93d1f',
  storageBucket: 'todo-app-93d1f.appspot.com',
  messagingSenderId: '716122413444',
  appId: '1:716122413444:web:1c9d612ba02f9582f765d1',
  measurementId: 'G-5SDWF87BVX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
