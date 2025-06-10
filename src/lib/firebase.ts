
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN1zAZsbo6_HDcFNVRvXekmY_JdTF4M3U",
  authDomain: "ai-app-bb63d.firebaseapp.com",
  projectId: "ai-app-bb63d",
  storageBucket: "ai-app-bb63d.firebasestorage.app",
  messagingSenderId: "511120628966",
  appId: "1:511120628966:web:8b08b99bca1d3b3acfaf27"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Initialize Firestore

export { app, auth, db };
