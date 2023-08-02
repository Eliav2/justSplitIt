// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { isDev } from '@/utils/isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAAOwFSClHo4dMZeD93oVRKfTrgiXqh7eE',
  authDomain: 'just-splitit.firebaseapp.com',
  projectId: 'just-splitit',
  storageBucket: 'just-splitit.appspot.com',
  messagingSenderId: '1077756061576',
  appId: '1:1077756061576:web:a19b48a7730ebc5343fc3d',
  measurementId: 'G-7JLS3BW791',
};

// Initialize Firebase
export const fbApp = initializeApp(firebaseConfig);
export const fbAuth = getAuth(fbApp);
export const fbDB = getFirestore(fbApp);

let _analytics: Analytics | undefined;

// console.log('isDev', isDev);
if (isDev) {
  // connectAuthEmulator(fbAuth, 'http://127.0.0.1:9099');
  // connectFirestoreEmulator(fbDB, '127.0.0.1', 8080);
} else {
  _analytics = getAnalytics(fbApp);
}
const analytics = _analytics;
