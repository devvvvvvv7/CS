import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDWTWjYtH08a3zTYJ9X4N-ltWaeNyEnj68",
  authDomain: "cs-balvigyan.firebaseapp.com",
  databaseURL: "https://cs-balvigyan-default-rtdb.firebaseio.com",
  projectId: "cs-balvigyan",
  storageBucket: "cs-balvigyan.firebasestorage.app",
  messagingSenderId: "945295526704",
  appId: "1:945295526704:web:0f1fa94f4a363cb54bd6f5",
  measurementId: "G-1QFC050JSN"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const ROOT_PATH = "/agriSensors";
