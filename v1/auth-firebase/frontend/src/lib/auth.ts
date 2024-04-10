import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(() => (window.location.href = "/dashboard"))
    .catch((error) => console.log(error));
};

export const logOut = () => {
  signOut(auth)
    .then(() => (window.location.href = "/"))
    .catch((error) => console.log(error));
};
