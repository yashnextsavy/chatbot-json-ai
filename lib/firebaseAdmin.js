
import admin from "firebase-admin";

// Initialize the app only if it hasn't been initialized already
let dbAdmin;

try {
  if (!admin.apps.length) {
    // Check if we have the service account credentials
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;
      
    admin.initializeApp({
      credential: serviceAccount 
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  }
  dbAdmin = admin.firestore();
} catch (error) {
  console.error("Firebase admin initialization error:", error);
  
  // Create a fallback in-memory store for development if Firebase fails
  dbAdmin = {
    collection: (name) => ({
      doc: (id) => ({
        set: async () => console.log(`Mock save to ${name}/${id}`),
        get: async () => ({
          exists: false,
          data: () => null
        })
      })
    })
  };
}

export { dbAdmin };
