import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase-config"; // XATO TO'G'RILANDI
import type { Majmua, Vazifa, Xarajat } from "../vazifa-tracker/src/types";

// Ma'lumotlar bazasidagi "majmualar" nomli "javon" (collection)
const majmualarCollectionRef = collection(db, "majmualar");

// Barcha ma'lumotlar bilan ishlaydigan yangi ombor
export const storage = {
  // Bu funksiya bazadagi o'zgarishlarga "quloq solib" turadi
  subscribe: (callback: (tasks: Majmua[]) => void): (() => void) => {
    const unsubscribe = onSnapshot(majmualarCollectionRef, (snapshot) => {
      const majmualar: Majmua[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nomi: data.nomi,
          masul: data.masul,
          rasm: data.rasm,
          izoh: data.izoh,
          createdAt: data.createdAt, // Bu endi son (timestamp)
          vazifalar: data.vazifalar.map((v: any) => ({
            ...v,
            xarajatlar: v.xarajatlar || [], // Agar xarajatlar bo'lmasa, bo'sh massiv
          })) as Vazifa[],
        };
      });
      // Eng yangilari tepada turishi uchun saralash
      majmualar.sort((a, b) => b.createdAt - a.createdAt);
      callback(majmualar);
    });
    return unsubscribe; // Komponentdan chiqqanda "quloq solish"ni to'xtatish uchun
  },

  // Yangi majmua qo'shish
  async addMajmua(majmua: Omit<Majmua, "id">): Promise<string> {
    const docRef = await addDoc(majmualarCollectionRef, majmua);
    return docRef.id;
  },

  // Majmuani yangilash
  async updateMajmua(id: string, updates: Partial<Majmua>): Promise<void> {
    const majmuaDoc = doc(db, "majmualar", id);
    await updateDoc(majmuaDoc, updates);
  },

  // Majmuani o'chirish
  async deleteMajmua(id: string): Promise<void> {
    const majmuaDoc = doc(db, "majmualar", id);
    await deleteDoc(majmuaDoc);
  },

  // Ko'plab majmualarni bir martada import qilish
  async importMajmualar(majmualar: Omit<Majmua, "id">[]): Promise<void> {
    const batch = writeBatch(db);
    majmualar.forEach((majmua) => {
      const docRef = doc(collection(db, "majmualar")); // Yangi ID yaratish
      batch.set(docRef, majmua);
    });
    await batch.commit();
  },
};
