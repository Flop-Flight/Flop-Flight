import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google Sign-In...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in:", user.email);
    
    // Provision user in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log("Provisioning new user in Firestore...");
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        plan: "standard",
        createdAt: new Date().toISOString()
      });
    }

    return user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    
    let message = "Failed to sign in. ";
    if (error.code === 'auth/popup-blocked') {
      message += "The sign-in popup was blocked by your browser. Please allow popups for this site.";
    } else if (error.code === 'auth/cancelled-popup-request') {
      message += "The sign-in process was cancelled.";
    } else if (error.code === 'auth/unauthorized-domain') {
      message += "This domain is not authorized for sign-in. Please add this domain to the authorized domains list in the Firebase Console.";
    } else {
      message += error.message || "An unknown error occurred.";
    }
    
    alert(message);
    throw error;
  }
};

export const logout = () => signOut(auth);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
