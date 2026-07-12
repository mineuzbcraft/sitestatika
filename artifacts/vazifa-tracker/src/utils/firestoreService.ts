
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import type { Majmua, Vazifa } from "../types";

const MAJMUALAR_COLLECTION = 'majmuallar'; // Firestore'dagi kolleksiya nomi

// Barcha majmualarni olish
export async function getMajmualar(userId: string): Promise<Majmua[]> {
    const q = query(collection(db, MAJMUALAR_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const majmualar: Majmua[] = [];

    querySnapshot.forEach(doc => {
        const data = doc.data();
        majmualar.push({
            id: doc.id,
            t_r: data.t_r,
            nomi: data.nomi,
            masul_shaxs: data.masul_shaxs,
            izoh: data.izoh,
            holat: data.holat,
            vazifalar: data.vazifalar || [],
            yaratilganVaqt: data.yaratilganVaqt,
            // Foizni hisoblash logikasi (front-end'da amalga oshiriladi)
        } as Majmua);
    });

    return majmualar.sort((a, b) => a.t_r - b.t_r); // Tartib raqami bo'yicha saralash
}

// Yangi majmua qo'shish (soddalashtirilgan)
export async function addMajmua(nomi: string, masul: string, izoh: string, userId: string): Promise<Majmua> {
    const q = query(collection(db, MAJMUALAR_COLLECTION), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const newTr = snapshot.size + 1; // Yangi tartib raqami

    const newMajmua = {
        t_r: newTr,
        nomi: nomi,
        masul_shaxs: { ism: masul },
        izoh: izoh,
        holat: "Qoniqarli" as const, // Boshlang'ich holat
        vazifalar: [], // Boshida ichki vazifalar bo'sh
        yaratilganVaqt: Timestamp.now(),
        userId: userId
    };

    const docRef = await addDoc(collection(db, MAJMUALAR_COLLECTION), newMajmua);

    return { id: docRef.id, ...newMajmua, holat: 'Qoniqarli' } as Majmua;
}

// Majmuani o'chirish
export async function deleteMajmua(id: string): Promise<void> {
    await deleteDoc(doc(db, MAJMUALAR_COLLECTION, id));
}

// Ichki vazifani qo'shish yoki holatini o'zgartirish (keyingi bosqichlarda kerak bo'ladi)
export async function updateMajmuaVazifalari(majmuaId: string, vazifalar: Vazifa[]): Promise<void> {
    const majmuaRef = doc(db, MAJMUALAR_COLLECTION, majmuaId);
    await updateDoc(majmuaRef, { vazifalar: vazifalar });
}

