// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * 
 * This app uses Firebase Firestore as its backend database for:
 * - Movie content metadata (from MovieLens dataset)
 * - User profiles with genre preferences
 * - User interactions for the recommendation system
 * 
 * SECURITY NOTE: All API keys and credentials are stored in environment variables (.env)
 * and are not directly exposed in the code.
 */

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize the Firebase app
console.log("Firebase initializing connection to Firestore");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * This Firebase instance connects to a real Firestore database that contains:
 * - 'content' collection: movies with metadata from MovieLens
 * - 'profiles' collection: user profiles with preferences
 * - 'interactions' collection: user interactions with content
 * 
 * The recommendation engine (recommendation.js) queries these collections
 * to generate personalized movie recommendations.
 */

export { app, db };