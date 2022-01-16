import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { getApp } from "firebase/app";

export default {
  googleAuth: async () => {
    const auth = getAuth(getApp("bater-ponto"));
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  },
  githubAuth: async () => {
    const auth = getAuth(getApp("bater-ponto"));
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  },
  db: () => {
    const db = getFirestore(getApp("bater-ponto"));
    return db;
  }
};
