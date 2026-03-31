/**
 * Firebase web client config (sabanci-takvim).
 * Firestore kuralları: users/{userId} için sadece request.auth.uid == userId okuma/yazma.
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyA-Bdi4kfRNX6yWgwHSHDeFPkGF17hNRG8",
  authDomain: "sabanci-takvim.firebaseapp.com",
  projectId: "sabanci-takvim",
  storageBucket: "sabanci-takvim.firebasestorage.app",
  messagingSenderId: "970942552661",
  appId: "1:970942552661:web:e29ae6363e7f1279e212dc",
  measurementId: "G-NWVEZF9RCP",

  // Google Identity Services OAuth Client ID (Web).
  // Required for Gmail scanning token client:
  // https://accounts.google.com/gsi/client
  googleClientId: "734195489784-sa91bnud7qb608r8pkn10ebr8aa8pu4t.apps.googleusercontent.com"
};
