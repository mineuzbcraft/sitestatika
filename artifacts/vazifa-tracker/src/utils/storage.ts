import type { Majmua } from "../types";

const KEY_PREFIX = "vazifa_tracker_data_";
const VERSION_KEY = "vazifa_tracker_version";
const CURRENT_VERSION = "4"; // Incremented version for new mock data

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const ALL_DEFAULT_DATA = {
  "M.Aripova": [
    {
        id: "default-5",
        nomi: "Xotin-qizlar majmuasi",
        masul: "M.Aripova",
        rasm: null,
        izoh: "Xotin-qizlar faolligini oshirish bo'yicha barcha tadbirlar bajarildi",
        createdAt: Date.now() - 1,
        vazifalar: [
          { id: uid(), nomi: "Ayollar tadbirkorligini qo'llab-quvvatlash", bajarildi: true, manba: "Tadbirkorlar palatasi", batafsil: "50 nafar xotin-qizlarga imtiyozli kreditlar ajratishga ko'maklashildi." },
          { id: uid(), nomi: "Huquqiy savodxonlik seminari", bajarildi: true, manba: "Adliya vazirligi", batafsil: "Mahallalarda 20 dan ortiq seminar o'tkazildi." },
          { id: uid(), nomi: "Kasbiy o'qitish kursi tashkil etish", bajarildi: true, manba: "Bandlik vazirligi", batafsil: "Tikuvchilik va pazandachilik kurslariga 100 nafar ayol jalb qilindi." },
          { id: uid(), nomi: "Oilaviy muammo oldini olish", bajarildi: true, manba: "Mahalla qo'mitasi", batafsil: "Psixologlar yordamida 30 ta oilaning muammolari hal etildi." },
          { id: uid(), nomi: "Ayollar iqtisodiy faollik hisoboti", bajarildi: true, manba: "Statistika qo'mitasi", batafsil: "Choraklik hisobot tayyorlanib, taqdim etildi." },
          { id: uid(), nomi: "Bolalar bog'chasiga qo'llab-quvvatlash", bajarildi: true, manba: "Maktabgacha ta'lim vazirligi", batafsil: "Uzoq hududlardagi 3 ta MTMga jihozlar bilan yordam berildi." },
          { id: uid(), nomi: "Sog'lom turmush tarzini targib qilish", bajarildi: true, manba: "Sog'liqni saqlash vazirligi", batafsil: "Sport musobaqalari va sog'lom ovqatlanish bo'yicha tadbirlar o'tkazildi." },
          { id: uid(), nomi: "Mahalla komissiyasi yig'ilishi", bajarildi: false, manba: "Hokimiyat yig'ilishi", batafsil: "Haftalik yig'ilish bayonnomasi asosida mahalla faollari va xotin-qizlar qo'mitasi bilan navbatdagi vazifalar muhokamasi." },
          { id: uid(), nomi: "Xorijiy tajriba o'rganish", bajarildi: false, manba: "Tashqi ishlar vazirligi", batafsil: "Turkiyaning oila va ijtimoiy siyosat sohasidagi yutuqlarini o'rganish va mahalliy sharoitga moslashtirish bo'yicha takliflar tayyorlash." },
          { id: uid(), nomi: "Yillik natijalar taqdimoti", bajarildi: false, manba: "Ichki hisobot", batafsil: "Yil davomida xotin-qizlar majmuasi tomonidan amalga oshirilgan ishlar va kelgusi yil uchun rejalar taqdimoti." },
        ],
      },
  ],
  "A.Azimov": [
    {
        id: "default-1",
        nomi: "Iqtisod majmuasi",
        masul: "A.Azimov",
        rasm: null,
        izoh: "Iqtisodiy rivojlanish va moliyaviy ko'rsatkichlar bo'yicha hisobot taqdim etildi",
        createdAt: Date.now() - 5,
        vazifalar: [
          { id: uid(), nomi: "Moliyaviy hisobot tayyorlash", bajarildi: true, manba: "Moliya vazirligi", batafsil: "Yillik moliyaviy hisobot tayyorlanib, tasdiqlandi.", xarajatlar: [{id: uid(), sana: "2023-11-10", summa: 1500000, izoh: "Auditorlik xizmati"}] },
          { id: uid(), nomi: "Byudjet rejasini tasdiqlash", bajarildi: true, manba: "Kengash yig'ilishi", batafsil: "Kelgusi yil uchun byudjet loyihasi ma'qullandi." },
          { id: uid(), nomi: "Investitsiya takliflarini ko'rib chiqish", bajarildi: true, manba: "Investitsiya qo'mitasi", batafsil: "3 ta yangi investitsion loyiha ko'rib chiqildi." },
          { id: uid(), nomi: "Iqtisodiy tahlil xulosasi", bajarildi: true, manba: "Tahliliy bo'lim", batafsil: "Choraklik iqtisodiy o'sish sur'atlari tahlil qilindi." },
          { id: uid(), nomi: "Choraklik ko'rsatkichlar prezentatsiyasi", bajarildi: true, manba: "Rahbariyat yig'ilishi", batafsil: "Asosiy iqtisodiy ko'rsatkichlar bo'yicha taqdimot o'tkazildi." },
          { id: uid(), nomi: "Soliq hisobotini topshirish", bajarildi: true, manba: "Soliq qo'mitasi", batafsil: "Barcha soliq hisobotlari o'z vaqtida topshirildi." },
          { id: uid(), nomi: "Raqobat tahlili", bajarildi: true, manba: "Marketing bo'limi", batafsil: "Bozordagi asosiy raqobatchilar faoliyati o'rganildi." },
          { id: uid(), nomi: "Xarajatlar optimizatsiyasi", bajarildi: false, manba: "Moliya bo'limi", batafsil: "Operatsion xarajatlarni 10% ga qisqartirish bo'yicha takliflar tayyorlash.", xarajatlar: [] },
          { id: uid(), nomi: "Daromad prognozi yangilash", bajarildi: false, manba: "Reja bo'limi", batafsil: "Yangi bozor sharoitlaridan kelib chiqib, daromadlar prognozini qayta ko'rib chiqish." },
          { id: uid(), nomi: "Yillik reja tuzish", bajarildi: false, manba: "Strategik rejalashtirish", batafsil: "Kelgusi 5 yillik strategik rivojlanish rejasini ishlab chiqish." },
        ],
      },
  ],
  "N.Ismatov": [
    {
        id: "default-2",
        nomi: "Qurilish va kommunal majmuasi",
        masul: "N.Ismatov",
        rasm: null,
        izoh: "Uchtepa tumani xalq qabulxonasida navbatdagi sayyor qabul bo'lib o'tdi. 10 nafar aholining murojaatlari tinglandi: 2 ta ijobiy hal etildi, 2 ta joyiga chiqib o'rganish belgilandi, 6 ta bo'yicha huquqiy tushuntirishlar berildi.",
        createdAt: Date.now() - 4,
        vazifalar: [
          { id: uid(), nomi: "Ob'ektlar ro'yxatini yangilash", bajarildi: true, manba: "Qurilish vazirligi", batafsil: "Yangi qurilish ob'ektlari ro'yxatga kiritildi." },
          { id: uid(), nomi: "Kommunal tarmoqlar tekshiruvi", bajarildi: false, manba: "Uy-joy kommunal xizmat ko'rsatish vazirligi", batafsil: "Kuz-qish mavsumiga tayyorgarlik doirasida issiqlik tarmoqlarini tekshirish.", xarajatlar: [] },
          { id: uid(), nomi: "Qurilish jarayonlari nazorati", bajarildi: false, manba: "Davlat arxitektura va qurilish nazorati", batafsil: "3 ta ob'ektda qurilish me'yorlariga rioya etilishi bo'yicha monitoring o'tkazish." },
          { id: uid(), nomi: "Texnik ekspertiza xulosasi", bajarildi: false, manba: "Litsenziyalangan ekspertiza markazi", batafsil: "Yangi qurilayotgan ko'prikning texnik holati bo'yicha xulosa olish." },
          { id: uid(), nomi: "Qurilish materiallar hisobi", bajarildi: true, manba: "Ta'minot bo'limi", batafsil: "Ombordagi materiallar qoldig'i inventarizatsiya qilindi.", xarajatlar: [{id: uid(), sana: "2023-12-01", summa: 25000000, izoh: "Sement va armatura xaridi"}] },
          { id: uid(), nomi: "Loyiha hujjatlarini tasdiqlash", bajarildi: false, manba: "Bosh plan instituti", batafsil: "Yangi turar-joy mavzesi loyihasini kelishish va tasdiqlash." },
          { id: uid(), nomi: "Xavfsizlik tekshiruvi", bajarildi: false, manba: "Favqulodda vaziyatlar vazirligi", batafsil: "Qurilish maydonlarida yong'in xavfsizligi qoidalariga rioya etilishini tekshirish." },
          { id: uid(), nomi: "Kommunal xizmatlar hisoboti", bajarildi: false, manba: "Mahalliy hokimiyat", batafsil: "Aholi tomonidan kommunal to'lovlar undirilishi holati bo'yicha hisobot." },
          { id: uid(), nomi: "Yig'ilish bayonnomasini tayyorlash", bajarildi: false, manba: "Ichki yig'ilish", batafsil: "Haftalik ishchi guruh yig'ilishi natijalari bo'yicha bayonnoma tayyorlash." },
          { id: uid(), nomi: "Ishchi kuchi hisobi", bajarildi: true, manba: "Kadrlar bo'limi", batafsil: "Ob'ektlardagi ishchilar soni va tarkibi bo'yicha ma'lumotlar yangilandi." },
        ],
      },
  ],
  "S.Abdikarimov": [
    {
        id: "default-3",
        nomi: "Investitsiya majmuasi",
        masul: "S.Abdikarimov",
        rasm: null,
        izoh: "Barcha investitsiya loyihalari bo'yicha hisobotlar o'z vaqtida topshirildi",
        createdAt: Date.now() - 3,
        vazifalar: [
          { id: uid(), nomi: "Investitsiya loyihasini taqdim etish", bajarildi: true, manba: "Xalqaro forum", batafsil: "'Tashkent Invest' forumida 2 ta yangi loyiha taqdimoti o'tkazildi.", xarajatlar: [{id: uid(), sana: "2023-11-20", summa: 5000000, izoh: "Forum ishtiroki uchun badal"}] },
          { id: uid(), nomi: "Xorijiy hamkorlar bilan uchrashuv", bajarildi: true, manba: "Savdo-sanoat palatasi", batafsil: "Germaniyalik investorlar bilan onlayn uchrashuv o'tkazildi." },
          { id: uid(), nomi: "Moliyalashtirish manbalari tahlili", bajarildi: true, manba: "Moliya bo'limi", batafsil: "3 ta loyiha uchun potentsial moliyalashtirish manbalari tahlil qilindi." },
          { id: uid(), nomi: "Loyiha risklarini baholash", bajarildi: true, manba: "Risk-menejment bo'limi", batafsil: "Yangi tekstil loyihasining valyuta risklari baholandi." },
          { id: uid(), nomi: "Shartnoma loyihasi tayyorlash", bajarildi: true, manba: "Yuridik bo'lim", batafsil: "Qishloq xo'jaligi loyihasi bo'yicha investitsion shartnoma loyihasi tayyor." },
          { id: uid(), nomi: "Foyda-zarar tahlili", bajarildi: true, manba: "Tahliliy bo'lim", batafsil: "Amaldagi 5 ta loyihaning choraklik foyda-zarar ko'rsatkichlari tahlil qilindi." },
          { id: uid(), nomi: "Eksport imkoniyatlari tadqiqi", bajarildi: true, manba: "Eksportni qo'llab-quvvatlash agentligi", batafsil: "Mahalliy mahsulotlarni Qozog'iston bozoriga eksport qilish imkoniyatlari o'rganildi." },
          { id: uid(), nomi: "Statistika ma'lumotlari to'plash", bajarildi: false, manba: "Statistika qo'mitasi", batafsil: "To'g'ridan-to'g'ri xorijiy investitsiyalar hajmi bo'yicha so'nggi ma'lumotlarni olish." },
          { id: uid(), nomi: "Hamkorlik protokolini imzolash", bajarildi: false, manba: "Xorijiy investorlar", batafsil: "Janubiy Koreyalik hamkorlar bilan texnologiya transferi bo'yicha protokolni imzolashga tayyorlash." },
          { id: uid(), nomi: "Kvartal hisobotini topshirish", bajarildi: false, manba: "Investitsiyalar va tashqi savdo vazirligi", batafsil: "Jalb qilingan investitsiyalar bo'yicha choraklik hisobotni tayyorlash." },
        ],
      },
  ],
  "O.Raxmonberdiyev": [
    {
        id: "default-4",
        nomi: "Ijtimoiy majmua",
        masul: "O.Raxmonberdiyev",
        rasm: null,
        izoh: "Aholining ijtimoiy himoyasini kuchaytirish bo'yicha ishlar olib borilmoqda.",
        createdAt: Date.now() - 2,
        vazifalar: [
          { id: uid(), nomi: "Aholi so'rovnomasi o'tkazish", bajarildi: true, manba: "'Ijtimoiy Fikr' markazi", batafsil: "Kommunal xizmatlar sifati bo'yicha aholi o'rtasida so'rovnoma o'tkazildi." },
          { id: uid(), nomi: "Ijtimoiy yordam dasturi yangilash", bajarildi: false, manba: "Mahalla va nuroniylarni qo'llab-quvvatlash vazirligi", batafsil: "Kam ta'minlangan oilalarga yordam ko'rsatish mezonlarini qayta ko'rib chiqish." },
          { id: uid(), nomi: "Mahalla faoliyati hisoboti", bajarildi: false, manba: "Mahalla raislari yig'ilishi", batafsil: "Har bir mahalla kesimida jinoyatchilik va huquqbuzarliklar holati bo'yicha hisobot tayyorlash." },
          { id: uid(), nomi: "Nogironlar uchun imkoniyatlar tadqiqi", bajarildi: false, manba: "Nogironlar jamiyati", batafsil: "Jamoat transporti va binolarda panduslar va boshqa qulayliklar mavjudligini o'rganish." },
          { id: uid(), nomi: "Yoshlar dasturi rejasi", bajarildi: false, manba: "Yoshlar ishlari agentligi", batafsil: "'Besh tashabbus' doirasida yoshlar uchun yangi to'garaklar va sport seksiyalarini ochish rejasi." },
          { id: uid(), nomi: "Ta'lim muassasalari monitoring", bajarildi: true, manba: "Xalq ta'limi vazirligi", batafsil: "Maktablardagi qishki isitish tizimlarining holati tekshirildi." },
          { id: uid(), nomi: "Sog'liqni saqlash ko'rsatkichlari", bajarildi: false, manba: "Sog'liqni saqlash vazirligi", batafsil: "Aholi o'rtasida yuqumli kasalliklar tarqalishining oldini olish bo'yicha chora-tadbirlar hisoboti." },
          { id: uid(), nomi: "Pensiya ta'minoti tekshiruvi", bajarildi: false, manba: "Pensiya jamg'armasi", batafsil: "Pensiya to'lovlarining o'z vaqtida va to'liq yetkazib berilishini nazorat qilish." },
          { id: uid(), nomi: "Jamoat tartibi hisoboti", bajarildi: false, manba: "Ichki ishlar vazirligi", batafsil: "O'tgan oy davomida jamoat joylarida sodir etilgan huquqbuzarliklar tahlili." },
          { id: uid(), nomi: "Aholini band etish dasturi", bajarildi: false, manba: "Bandlik vazirligi", batafsil: "Yangi ish o'rinlari yaratish va ishsizlarni kasbga o'qitish dasturining ijrosi." },
        ],
      },
  ]
}

export function getAvailableMasullar(): string[] {
    return Object.keys(ALL_DEFAULT_DATA);
}


export function loadData(masul: string): Majmua[] {
  const masulKey = KEY_PREFIX + masul;
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const defaultData = ALL_DEFAULT_DATA[masul as keyof typeof ALL_DEFAULT_DATA] || [];

    if (version !== CURRENT_VERSION) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      saveData(masul, defaultData);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return defaultData;
    }

    const raw = localStorage.getItem(masulKey);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Majmua[];
    if (parsed.length === 0) return defaultData;
    return parsed;
  } catch {
    return ALL_DEFAULT_DATA[masul as keyof typeof ALL_DEFAULT_DATA] || [];
  }
}

export function saveData(masul: string, data: Majmua[]): void {
  const masulKey = KEY_PREFIX + masul;
  localStorage.setItem(masulKey, JSON.stringify(data));
  // Only update version when saving, not on every load
  const currentVersion = localStorage.getItem(VERSION_KEY);
  if (currentVersion !== CURRENT_VERSION) {
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
}
