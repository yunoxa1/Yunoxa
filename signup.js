// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRQABkXzZh3GEhZly-JP3CUUJtJM-Aakg",
  authDomain: "yunoxa-adc7c.firebaseapp.com",
  projectId: "yunoxa-adc7c",
  storageBucket: "yunoxa-adc7c.firebasestorage.app",
  messagingSenderId: "262846051348",
  appId: "1:262846051348:web:3aeb2e44d05ee4fee0a301",
  measurementId: "G-ZP8K0JJRGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//inputs
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
//submit button

const submit = document.getElementById('submit').value;
submit.addEventListner("click",function(event) {
event.preventDefault( )
alert(5)
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Creating Account")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });  
})