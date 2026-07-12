
import { get, ref, onValue } from "firebase/database";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

type Task = {
  id: string;
  [key: string]: any;
};

type Majors = {
  [key: string]: Task[];
};

let cachedData: Majors | null = null;

// Listener funksiyalari uchun massiv
const listeners: ((data: Majors | null) => void)[] = [];

// Ma'lumotlarni Firebase'dan olish funksiyasi (Firestore uchun)
export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "vazifalar"));
    const data: Majors = {};
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const majorName = docData.majmua; // Yoki qaysi maydonda majmua nomi turgan bo'lsa
      if (!data[majorName]) {
        data[majorName] = [];
      }
      data[majorName].push({ id: doc.id, ...docData });
    });

    cachedData = data;
    // Barcha listener'larni yangi ma'lumot bilan chaqirish
    listeners.forEach(listener => listener(cachedData));
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    // Xatolik yuz berganda ham listener'larni xabardor qilish
    listeners.forEach(listener => listener(null));
  }
};

// Ma'lumot o'zgarishlarini tinglash uchun funksiya
export const subscribe = (listener: (data: Majors | null) => void) => {
  // Yangi listener'ni ro'yxatga qo'shish
  listeners.push(listener);
  // Dastlabki ma'lumotni yuborish
  listener(cachedData);

  // Unsubscribe funksiyasini qaytarish
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Dastlabki ma'lumotlarni yuklash
fetchData();
