import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {getDatabase} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '@react-native-firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD254mEHMowxreLrCUGC1EIh_AZe5mHpdY',
  authDomain: 'group-chat-app-bt.firebaseapp.com',
  databaseURL: 'https://group-chat-app-bt-default-rtdb.firebaseio.com',
  projectId: 'group-chat-app-bt',
  storageBucket: 'group-chat-app-bt.appspot.com',
  messagingSenderId: '235494645211',
  appId: '1:235494645211:web:a08c706351661e5ad55bfe',
};

// Check if Firebase has been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Realtime Database
const database = getDatabase(app);

export {auth, database};
