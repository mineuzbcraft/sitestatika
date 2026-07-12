export interface Xarajat {
  id: string;
  sana: string;
  summa: number;
  izoh: string;
}

export interface Vazifa {
  id: string;
  nomi: string;
  bajarildi: boolean;
  manba?: string;
  pdf?: string | null;
  pdfNomi?: string;
  batafsil?: string;
  xarajatlar?: Xarajat[];
}

export interface Majmua {
  id: string;
  nomi: string;
  masul: string;
  rasm: string | null;
  izoh: string;
  vazifalar: Vazifa[];
  createdAt: number;
}
