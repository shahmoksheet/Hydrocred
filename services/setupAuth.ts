import { auth, db } from './firebase';
import { ALL_GOVERNMENT_USERS } from '../constants/govData';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Creates Firebase Auth users for pre-seeded government accounts
 * This is a one-time setup to ensure authentication works properly
 */
export const setupGovernmentAuth = async () => {
  if (!auth || !db) {
    console.log("Firebase not initialized, skipping auth setup.");
    return;
  }

  console.log("Setting up Firebase Auth for government accounts...");

  for (const user of ALL_GOVERNMENT_USERS) {
    try {
      // Check if user already exists in Firebase Auth
      try {
        // Try to sign in to check if user exists
        await signInWithEmailAndPassword(auth, user.email, user.password);
        console.log(`✅ ${user.name} already exists in Firebase Auth`);
        // Sign out immediately
        await signOut(auth);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // User doesn't exist, create them
          console.log(`🔄 Creating Firebase Auth user for ${user.name}...`);
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            user.email, 
            user.password
          );
          
          // Update the Firestore document to link it with the Firebase Auth UID
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Update the document to include the Firebase Auth UID
            await setDoc(userDocRef, {
              ...userDoc.data(),
              firebaseUid: userCredential.user.uid
            }, { merge: true });
            console.log(`✅ Created Firebase Auth user for ${user.name}`);
          }
          
          // Sign out immediately
          await signOut(auth);
        } else {
          console.error(`❌ Error checking ${user.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to setup ${user.name}:`, error);
    }
  }

  console.log("Firebase Auth setup completed!");
};

/**
 * Check if a government account exists and can authenticate
 */
export const checkGovernmentAccount = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await signOut(auth);
    return { success: true, uid: userCredential.user.uid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
