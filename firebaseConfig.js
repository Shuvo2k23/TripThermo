import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAGITN2yX4D4Ge4LGRxqahJx3BGQyOrTF0",
  authDomain: "tripthermo.firebaseapp.com",
  databaseURL: "https://tripthermo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tripthermo",
  storageBucket: "tripthermo.firebasestorage.app",
  messagingSenderId: "330524972184",
  appId: "1:330524972184:web:268b6aa6cd174a67aeeced",
  measurementId: "G-FMQ7KG87JR"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
// let analytics;
// isSupported()
//   .then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   })
//   .catch((e) => {
//     console.log('Analytics not supported', e);
//   });
// if(analytics)
// export { analytics };
export const db = getDatabase(app);
export const auth = getAuth(app);
