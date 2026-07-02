import type { Majmua } from "../types";

const KEY = "vazifa_tracker_data";
const VERSION_KEY = "vazifa_tracker_version";
const CURRENT_VERSION = "2";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_DATA: Majmua[] = [
  {
    id: "default-1",
    nomi: "Iqtisod majmuasi",
    masul: "A.Azimov",
    rasm: null,
    izoh: "Iqtisodiy rivojlanish va moliyaviy ko'rsatkichlar bo'yicha hisobot taqdim etildi",
    createdAt: Date.now() - 5,
    vazifalar: [
      { id: uid(), nomi: "Moliyaviy hisobot tayyorlash", bajarildi: true },
      { id: uid(), nomi: "Byudjet rejasini tasdiqlash", bajarildi: true },
      { id: uid(), nomi: "Investitsiya takliflarini ko'rib chiqish", bajarildi: true },
      { id: uid(), nomi: "Iqtisodiy tahlil xulosasi", bajarildi: true },
      { id: uid(), nomi: "Choraklik ko'rsatkichlar prezentatsiyasi", bajarildi: true },
      { id: uid(), nomi: "Soliq hisobotini topshirish", bajarildi: true },
      { id: uid(), nomi: "Raqobat tahlili", bajarildi: true },
      { id: uid(), nomi: "Xarajatlar optimizatsiyasi", bajarildi: false },
      { id: uid(), nomi: "Daromad prognozi yangilash", bajarildi: false },
      { id: uid(), nomi: "Yillik reja tuzish", bajarildi: false },
    ],
  },
  {
    id: "default-2",
    nomi: "Qurilish va kommunal majmuasi",
    masul: "N.Ismatov",
    rasm: null,
    izoh: "Uchtepa tumani xalq qabulxonasida navbatdagi sayyor qabul bo'lib o'tdi. 10 nafar aholining murojaatlari tinglandi: 2 ta ijobiy hal etildi, 2 ta joyiga chiqib o'rganish belgilandi, 6 ta bo'yicha huquqiy tushuntirishlar berildi.",
    createdAt: Date.now() - 4,
    vazifalar: [
      { id: uid(), nomi: "Ob'ektlar ro'yxatini yangilash", bajarildi: true },
      { id: uid(), nomi: "Kommunal tarmoqlar tekshiruvi", bajarildi: false },
      { id: uid(), nomi: "Qurilish jarayonlari nazorati", bajarildi: false },
      { id: uid(), nomi: "Texnik ekspertiza xulosasi", bajarildi: false },
      { id: uid(), nomi: "Qurilish materiallar hisobi", bajarildi: true },
      { id: uid(), nomi: "Loyiha hujjatlarini tasdiqlash", bajarildi: false },
      { id: uid(), nomi: "Xavfsizlik tekshiruvi", bajarildi: false },
      { id: uid(), nomi: "Kommunal xizmatlar hisoboti", bajarildi: false },
      { id: uid(), nomi: "Yig'ilish bayonnomasini tayyorlash", bajarildi: false },
      { id: uid(), nomi: "Ishchi kuchi hisobi", bajarildi: true },
    ],
  },
  {
    id: "default-3",
    nomi: "Investitsiya majmuasi",
    masul: "S.Abdikarimov",
    rasm: null,
    izoh: "Barcha investitsiya loyihalari bo'yicha hisobotlar o'z vaqtida topshirildi",
    createdAt: Date.now() - 3,
    vazifalar: [
      { id: uid(), nomi: "Investitsiya loyihasini taqdim etish", bajarildi: true },
      { id: uid(), nomi: "Xorijiy hamkorlar bilan uchrashuv", bajarildi: true },
      { id: uid(), nomi: "Moliyalashtirish manbalari tahlili", bajarildi: true },
      { id: uid(), nomi: "Loyiha risklarini baholash", bajarildi: true },
      { id: uid(), nomi: "Shartnoma loyihasi tayyorlash", bajarildi: true },
      { id: uid(), nomi: "Foyda-zarar tahlili", bajarildi: true },
      { id: uid(), nomi: "Eksport imkoniyatlari tadqiqi", bajarildi: true },
      { id: uid(), nomi: "Statistika ma'lumotlari to'plash", bajarildi: false },
      { id: uid(), nomi: "Hamkorlik protokolini imzolash", bajarildi: false },
      { id: uid(), nomi: "Kvartal hisobotini topshirish", bajarildi: false },
    ],
  },
  {
    id: "default-4",
    nomi: "Ijtimoiy majmua",
    masul: "O.Raxmonberdiyev",
    rasm: null,
    izoh: "",
    createdAt: Date.now() - 2,
    vazifalar: [
      { id: uid(), nomi: "Aholi so'rovnomasi o'tkazish", bajarildi: true },
      { id: uid(), nomi: "Ijtimoiy yordam dasturi yangilash", bajarildi: false },
      { id: uid(), nomi: "Mahalla faoliyati hisoboti", bajarildi: false },
      { id: uid(), nomi: "Nogironlar uchun imkoniyatlar tadqiqi", bajarildi: false },
      { id: uid(), nomi: "Yoshlar dasturi rejasi", bajarildi: false },
      { id: uid(), nomi: "Ta'lim muassasalari monitoring", bajarildi: true },
      { id: uid(), nomi: "Sog'liqni saqlash ko'rsatkichlari", bajarildi: false },
      { id: uid(), nomi: "Pensiya ta'minoti tekshiruvi", bajarildi: false },
      { id: uid(), nomi: "Jamoat tartibi hisoboti", bajarildi: false },
      { id: uid(), nomi: "Aholini band etish dasturi", bajarildi: false },
    ],
  },
  {
    id: "default-5",
    nomi: "Xotin-qizlar majmuasi",
    masul: "M.Aripova",
    rasm: null,
    izoh: "Xotin-qizlar faolligini oshirish bo'yicha barcha tadbirlar bajarildi",
    createdAt: Date.now() - 1,
    vazifalar: [
      { id: uid(), nomi: "Ayollar tadbirkorligini qo'llab-quvvatlash", bajarildi: true },
      { id: uid(), nomi: "Huquqiy savodxonlik seminari", bajarildi: true },
      { id: uid(), nomi: "Kasbiy o'qitish kursi tashkil etish", bajarildi: true },
      { id: uid(), nomi: "Oilaviy muammo oldini olish", bajarildi: true },
      { id: uid(), nomi: "Ayollar iqtisodiy faollik hisoboti", bajarildi: true },
      { id: uid(), nomi: "Bolalar bog'chasiga qo'llab-quvvatlash", bajarildi: true },
      { id: uid(), nomi: "Sog'lom turmush tarzini targib qilish", bajarildi: true },
      { id: uid(), nomi: "Mahalla komissiyasi yig'ilishi", bajarildi: false },
      { id: uid(), nomi: "Xorijiy tajriba o'rganish", bajarildi: false },
      { id: uid(), nomi: "Yillik natijalar taqdimoti", bajarildi: false },
    ],
  },
];

export function loadData(): Majmua[] {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      saveData(DEFAULT_DATA);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return DEFAULT_DATA;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Majmua[];
    if (parsed.length === 0) return DEFAULT_DATA;
    return parsed;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: Majmua[]): void {
  localStorage.setItem(KEY, JSON.stringify(data));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}
