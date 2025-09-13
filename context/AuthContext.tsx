import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { auth, db } from '../services/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role, location?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        try {
          // First, try to get the user document using the Firebase Auth UID
          let userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);
          
          // If not found by UID, check if this is a pre-seeded account by email
          if (!userDoc.exists()) {
            console.log("User document not found by UID, checking by email...");
            
            // Check if this email matches any pre-seeded government account
            const email = firebaseUser.email;
            if (email) {
              // Try to find the user document by email in the users collection
              const usersRef = collection(db, 'users');
              const q = query(usersRef, where('email', '==', email));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                // Found the user by email, use this document
                const userData = querySnapshot.docs[0].data();
                const userId = querySnapshot.docs[0].id;
                
                // Check if this document has a firebaseUid that matches
                if (userData.firebaseUid === firebaseUser.uid) {
                  setUser({ 
                    id: userId, 
                    ...userData 
                  } as User);
                  console.log("Found linked user by email:", userData.name);
                } else {
                  // Update the document with the Firebase UID for future use
                  await setDoc(doc(db, 'users', userId), {
                    ...userData,
                    firebaseUid: firebaseUser.uid
                  }, { merge: true });
                  
                  setUser({ 
                    id: userId, 
                    ...userData 
                  } as User);
                  console.log("Linked user account:", userData.name);
                }
              } else {
                console.error("User document not found in Firestore by email either!");
                setUser(null);
              }
            } else {
              console.error("User document not found in Firestore!");
              setUser(null);
            }
          } else {
            // User found by UID
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // First, check if this is a pre-seeded government account
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // This is a pre-seeded account, we need to create a Firebase Auth user
        const userData = querySnapshot.docs[0].data();
        console.log("Found pre-seeded account:", userData.name);
        
        // For pre-seeded accounts, we'll use the existing password
        // In a real app, you'd want to handle this differently
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Regular user login
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const register = async (name: string, email: string, password: string, role: Role, location?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create a user profile document in Firestore
      const newUser: Omit<User, 'id' | 'password'> = {
          name,
          email,
          role,
      };
      
      if (role === Role.Producer && location) {
          newUser.location = location;
      }

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      
      setUser({ id: firebaseUser.uid, ...newUser });
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};