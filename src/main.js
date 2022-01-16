import App from "./App.svelte";
import {  initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlcNO-19TwzWp0fwMR2udBsTi0zthv_40",
  authDomain: "bater-ponto-44d22.firebaseapp.com",
  projectId: "bater-ponto-44d22",
  storageBucket: "bater-ponto-44d22.appspot.com",
  messagingSenderId: "837556913990",
  appId: "1:837556913990:web:a356a8a71c4fcef8e98747",
  measurementId: "G-R887FDJGER",
};

const firebaseApp = initializeApp(firebaseConfig, "bater-ponto");

const analytics = getAnalytics(firebaseApp);


const app = new App({
  target: document.body,
});

export default app;
