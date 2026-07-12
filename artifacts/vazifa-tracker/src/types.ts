export interface Expense {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface SubTask {
  id: string;
  nomi: string;
  bajarildi: boolean;
  manba?: string;
  pdf?: string | null;
  pdfNomi?: string;
  details?: string;
  expenses?: Expense[];
}

export interface Task {
  id:string;
  nomi: string;
  masul: string;
  rasm: string | null;
  izoh: string;
  vazifalar: SubTask[];
}
