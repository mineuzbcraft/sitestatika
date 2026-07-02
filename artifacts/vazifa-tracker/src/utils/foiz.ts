export function foizHisoblash(jami: number, bajarilgan: number): number {
  if (jami === 0) return 0;
  return Math.round((bajarilgan / jami) * 100);
}

export type RangTuri = "yashil" | "sariq" | "qizil";

export function rangAniqla(foiz: number): RangTuri {
  if (foiz >= 70) return "yashil";
  if (foiz >= 50) return "sariq";
  return "qizil";
}

export const RANG_STYLES: Record<RangTuri, { bg: string; text: string; border: string }> = {
  yashil: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
  },
  sariq: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
    border: "border-yellow-500",
  },
  qizil: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-600",
  },
};

export const RANG_ROW_BG: Record<RangTuri, string> = {
  yashil: "bg-green-50",
  sariq: "bg-yellow-50",
  qizil: "bg-red-50",
};
