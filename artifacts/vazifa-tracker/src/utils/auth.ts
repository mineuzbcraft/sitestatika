
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth"; // Import as a type
import { auth } from "../firebase-config";

// Asl login funksiyasi (Firebase bilan)
export async function login(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

// Foydalanuvchi yaratish (hozircha ishlatilmaydi, lekin talabga binoan mavjud)
export async function register(email: string, pass: string): Promise<User> {
  throw new Error("Ro'yxatdan o'tish uchun adminga murojaat qiling.");
}

// Parolni tiklash (hozircha ishlatilmaydi)
export async function resetPassword(email: string): Promise<void> {
  throw new Error("Parolni tiklash uchun adminga murojaat qiling.");
}

// Tizimdan chiqish
export async function logout(): Promise<void> {
  await signOut(auth);
}

// Foydalanuvchi holatini kuzatish
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
