import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAliUTGbNwxqMPQzSSDj3ggnWiEGtTS30k",
  authDomain: "riro-4b642.firebaseapp.com",
  projectId: "riro-4b642",
  storageBucket: "riro-4b642.firebasestorage.app",
  messagingSenderId: "476157148304",
  appId: "1:476157148304:web:2f5baea61f6ba6db716c15"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);