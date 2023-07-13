// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXOPzvHQrDt8C0cyOFoaDAa5H9Faumceo",
  authDomain: "triviatitans-32271.firebaseapp.com",
  projectId: "triviatitans-32271",
  storageBucket: "triviatitans-32271.appspot.com",
  messagingSenderId: "376273531502",
  appId: "1:376273531502:web:dd6ff4a45bae7064df2c7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);