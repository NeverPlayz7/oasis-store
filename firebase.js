import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.googleLogin = function(){
  signInWithPopup(auth,new GoogleAuthProvider())
    .then(res=>alert("Welcome "+res.user.displayName));
}

window.facebookLogin = function(){
  signInWithPopup(auth,new FacebookAuthProvider())
    .then(res=>alert("Welcome "+res.user.displayName));
}
