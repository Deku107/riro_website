import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFWg2VlWtF6PmjN7h_NOnb6sFTKjYx4fE",
  authDomain: "riro-57795.firebaseapp.com",
  projectId: "riro-57795",
  storageBucket: "riro-57795.firebasestorage.app",
  messagingSenderId: "670792522004",
  appId: "1:670792522004:web:e00e5e0afa1930c9228a01"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);