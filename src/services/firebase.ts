import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

// Get config keys directly from our provisioned firebase applet config
const firebaseConfig = {
  apiKey: "AIzaSyDqq8_FyAZQhgjWULUgbJK9No-FdWlkxbA",
  authDomain: "gen-lang-client-0452856401.firebaseapp.com",
  projectId: "gen-lang-client-0452856401",
  storageBucket: "gen-lang-client-0452856401.firebasestorage.app",
  messagingSenderId: "114013936052",
  appId: "1:114013936052:web:32beeea60f27c14c9dfae1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-eddfcf2b-6332-40ff-a783-d03d2d3a1d3a");

export default app;
