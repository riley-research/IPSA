import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUtUib2FRyzF_yu4AhoI93wK6SZ5_4Dh0",
  authDomain: "ipsa-2.firebaseapp.com",
  projectId: "ipsa-2",
  storageBucket: "ipsa-2.appspot.com",
  messagingSenderId: "459249942719",
  appId: "1:459249942719:web:4f4885a21443a1c15e060a",
  measurementId: "G-J3MTJ4ZBT7",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
