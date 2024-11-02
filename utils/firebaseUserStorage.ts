// utils/firebaseUserStorage.ts
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

// Hàm lưu thông tin người dùng vào Firestore
export async function saveUserProfileToFirestore(uid: string, profile: UserProfile) {
  await setDoc(doc(db, "users", uid), profile);
}

// Hàm lấy thông tin người dùng từ Firestore
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}
