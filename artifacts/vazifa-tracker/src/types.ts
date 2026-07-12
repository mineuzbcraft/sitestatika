
import { Timestamp } from "firebase/firestore";

// Har bir kichik vazifaning tuzilishi
export interface Vazifa {
  id: string;
  matn: string;
  bajarildi: boolean;
}

// Asosiy "Majmua"ning tuzilishi (jadvaldagi har bir qator)
export interface Majmua {
  id: string; // Firestore'dagi unikal ID
  t_r: number; // Tartib raqami
  nomi: string; // Majmua nomi
  masul_shaxs: {
    ism: string;
    avatar?: string; // Rasm uchun (kelajakda)
  };
  izoh: string;
  holat: 'Ijobiy' | 'Qoniqarli' | 'Salbiy';
  vazifalar: Vazifa[]; // Ichki vazifalar ro'yxati
  yaratilganVaqt: Timestamp;
}

// Umumiy statistika uchun
export interface Statistika {
  jami: number;
  bajarilgan: number;
  umumiy_foiz: number;
}
