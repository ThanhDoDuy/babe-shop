import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Đăng nhập với Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign-in", error);
  }
}

// Đăng xuất người dùng
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out", error);
  }
}
