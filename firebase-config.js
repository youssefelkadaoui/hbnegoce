import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBGFppshKdZBTL4jZW2OVm-UXSzsstbjSc',
  authDomain: 'hbnegoce-b5cf9.firebaseapp.com',
  projectId: 'hbnegoce-b5cf9',
  storageBucket: 'hbnegoce-b5cf9.firebasestorage.app',
  messagingSenderId: '477419993973',
  appId: '1:477419993973:web:ce0228c0ce76f386d9313c',
  measurementId: 'G-9PJTNQS6DS'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

const analyticsPromise = isSupported()
  .then((supported) => supported ? getAnalytics(app) : null)
  .catch(() => null);

export { app, analyticsPromise, auth, database, firebaseConfig, storage };
