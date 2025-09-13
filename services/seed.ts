import { db } from './firebase';
import { ALL_GOVERNMENT_USERS } from '../constants/govData';
import { doc, getDoc, writeBatch } from 'firebase/firestore';

/**
 * Checks if the essential government accounts (certifiers, regulators) exist
 * in the Firestore database and creates them if they don't. This is a one-time
 * operation to ensure the application has the necessary data to function.
 */
export const seedDatabase = async () => {
  if (!db) {
    console.log("Database not initialized, skipping seeding.");
    return;
  }
  
  // Use a key user (e.g., the national regulator) to check if seeding is needed.
  const checkDocRef = doc(db, 'users', 'regulator-national-india');
  const docSnap = await getDoc(checkDocRef);

  // If the document already exists, seeding has already been done.
  if (docSnap.exists()) {
    console.log("Government accounts already exist. Seeding not required.");
    return;
  }

  console.log("Essential government accounts not found. Seeding database...");

  try {
    const batch = writeBatch(db);

    ALL_GOVERNMENT_USERS.forEach((user) => {
      // The document ID will be the user's pre-defined 'id' field.
      const userDocRef = doc(db, 'users', user.id);
      
      // We don't store passwords in Firestore. Create a copy of the user object without it.
      const { password, ...userData } = user;
      
      batch.set(userDocRef, userData);
    });

    await batch.commit();
    console.log(`Successfully seeded ${ALL_GOVERNMENT_USERS.length} government accounts.`);
  } catch (error) {
    console.error("Error seeding database with government accounts:", error);
    // This is a critical error, so we should throw it to make it visible.
    throw new Error("Failed to initialize the application's required user data.");
  }
};
