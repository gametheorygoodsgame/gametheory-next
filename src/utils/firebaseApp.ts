'use client';

import { initializeApp } from 'firebase/app';
import { logger } from '@/utils/logger';

// Define the configuration object containing the Firebase project's API keys and settings
const firebaseConfig = {
  apiKey: 'AIzaSyCH16_7ivnP9YMn4zBjxerQUxTrs06EdxA',
  authDomain: 'gametheory-leibniz-fh.firebaseapp.com',
  projectId: 'gametheory-leibniz-fh',
  storageBucket: 'gametheory-leibniz-fh.appspot.com',
  messagingSenderId: '433035142299',
  appId: '1:433035142299:web:b90b400794a35dbd6d923e',
  measurementId: 'G-FSV06ZK8W7',
};

// Initialize Firebase with the configuration object
export const firebase = initializeApp(firebaseConfig);
logger.debug(firebase);
