import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// =================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
//
// To run this application, you must create your own Firebase project and paste
// your web app's configuration object here.
//
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Create a new project.
// 3. Go to Project Settings (⚙️) > General tab.
// 4. Under "Your apps", click the Web icon (</>) to add a new web app.
// 5. Copy the `firebaseConfig` object and paste it below.
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBWfkkCUO1O47-slgZEKxoP0AP0uHLh-6M",
  authDomain: "hydro-cred-51499.firebaseapp.com",
  projectId: "hydro-cred-51499",
  storageBucket: "hydro-cred-51499.firebasestorage.app",
  messagingSenderId: "67833483585",
  appId: "1:67833483585:web:10c97960feef8baca6d1c0",
  measurementId: "G-3Q8SM1ZFJQ"
};

// Check if the config values are placeholders. This is the definitive check.
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Conditionally initialize Firebase to prevent connection errors on first run.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isFirebaseConfigured) {
  // If the config is provided, initialize Firebase.
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // If not configured, these will be undefined, but the app logic in index.tsx
  // will show the FirebaseSetupPage, so they won't be used.
  console.warn("Firebase is not configured. Please follow the setup instructions.");
}

// Export the initialized services.
// The app will only attempt to use them if isFirebaseConfigured is true.
export { app, auth, db };
