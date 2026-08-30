// Firebase is loaded as an ES module so every page can share one app instance.
// Add other Firebase services here only when the site starts using them.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDZPV7EDQXp920I0ypMCH0cMX8RPhIf9Bk',
  authDomain: 'hbnegoce-20977.firebaseapp.com',
  databaseURL: 'https://hbnegoce-20977-default-rtdb.firebaseio.com',
  projectId: 'hbnegoce-20977',
  storageBucket: 'hbnegoce-20977.firebasestorage.app',
  messagingSenderId: '965623113192',
  appId: '1:965623113192:web:bd95e7f385532cc3cd705d',
  measurementId: 'G-BQB5YL9050'
};

// Reuse the existing app if this module is ever imported more than once.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics is not supported in every browser/context, so initialise it safely.
const analyticsPromise = isSupported().then((supported) => supported ? getAnalytics(app) : null).catch(() => null);

export { app, analyticsPromise, auth, database, firebaseConfig, storage };

