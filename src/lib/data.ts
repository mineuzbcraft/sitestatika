import {
  LayoutDashboard,
  Pill,
  Bus,
  FilePenLine,
  School,
  Gavel,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';

export const tashkentDistricts = [
  "Bektemir",
  "Chilonzor",
  "Mirobod",
  "Mirzo Ulug'bek",
  "Sergeli",
  "Shayxontohur",
  "Olmazor",
  "Uchtepa",
  "Yakkasaroy",
  "Yashnobod",
  "Yunusobod",
];

export const arizaTypes = [
  'Ishga kirish arizasi',
  'Oʻqishga kirish arizasi',
  'Moddiy yordam soʻrash',
  'Akademik taʼtil soʻrash',
  'Ishdan boʻshatish arizasi',
  'Tavsiyanoma olish',
  'Murojaat',
  'Boshqa',
];

export const navItems = [
  { name: "Boshqaruv paneli", href: "/dashboard", icon: LayoutDashboard, adminOnly: true },
  { name: "Ariza Yaratish", href: "/ariza", icon: FilePenLine },
  { name: "Dori-Info", href: "/doriinfo", icon: Pill },
  { name: "ToshBus", href: "/toshbus", icon: Bus },
  { name: "TanlayUni", href: "/tanlayuni", icon: School },
  { name: "Huquqim", href: "/huquqim", icon: Gavel },
  { name: "Mahalla Muammo", href: "/mahalla-muammo", icon: AlertTriangle },
  { name: "Kasbim", href: "/kasbim", icon: Briefcase },
];

export const problemTypes = [
  'Yo\'l ta\'miri',
  'Chiqindilarni olib ketish',
  'Elektr ta\'minotidagi uzilishlar',
  'Suv ta\'minotidagi uzilishlar',
  'Gaz ta\'minotidagi uzilishlar',
  'Obodonlashtirish',
  'Daraxtlarni kesish',
  'Boshqa'
];

export const universitySubjects = [
    "Matematika",
    "Fizika",
    "Kimyo",
    "Biologiya",
    "Tarix",
    "Ingliz tili",
    "Ona tili va adabiyoti"
];

export type University = {
    name: string;
    description: string;
    minScore: number;
    subjects: string[];
    imageUrl: string;
};

export const universities: University[] = [
    {
        name: "Toshkent Axborot Texnologiyalari Universiteti",
        description: "Markaziy Osiyodagi yetakchi texnika universiteti.",
        minScore: 120,
        subjects: ["Matematika", "Fizika", "Ingliz tili"],
        imageUrl: "https://picsum.photos/seed/tuit/400/200"
    },
    {
        name: "O'zbekiston Milliy Universiteti",
        description: "Mamlakatning eng qadimgi va nufuzli universiteti.",
        minScore: 110,
        subjects: ["Matematika", "Tarix", "Ona tili va adabiyoti"],
        imageUrl: "https://picsum.photos/seed/nuu/400/200"
    },
    {
        name: "Jahon Iqtisodiyoti va Diplomatiya Universiteti",
        description: "Xalqaro munosabatlar va iqtisodiyot sohasida mutaxassislar tayyorlaydi.",
        minScore: 150,
        subjects: ["Ingliz tili", "Tarix", "Matematika"],
        imageUrl: "https://picsum.photos/seed/uwed/400/200"
    },
    {
        name: "Toshkent Tibbiyot Akademiyasi",
        description: "Tibbiyot sohasida yuqori malakali kadrlarni tayyorlaydigan markaz.",
        minScore: 140,
        subjects: ["Kimyo", "Biologiya"],
        imageUrl: "https://picsum.photos/seed/tma/400/200"
    },
    {
        name: "Toshkent Davlat Iqtisodiyot Universiteti",
        description: "Iqtisodiyot va biznes sohasida ta'lim beruvchi yirik o'quv yurti.",
        minScore: 115,
        subjects: ["Matematika", "Ingliz tili"],
        imageUrl: "https://picsum.photos/seed/tsue/400/200"
    },
    {
        name: "Inha Universiteti Toshkentda",
        description: "Axborot texnologiyalari va logistika bo'yicha Janubiy Koreya andozalari.",
        minScore: 130,
        subjects: ["Matematika", "Fizika", "Ingliz tili"],
        imageUrl: "https://picsum.photos/seed/inha/400/200"
    },
    {
        name: "Toshkent Davlat Sharqshunoslik Universiteti",
        description: "Sharq tillari va madaniyatini o'rganish bo'yicha markaz.",
        minScore: 105,
        subjects: ["Tarix", "Ingliz tili", "Ona tili va adabiyoti"],
        imageUrl: "https://picsum.photos/seed/tshu/400/200"
    }
];

export const busRoutes = [
  { id: '1', number: '1', route: 'Oloy bozori - Yunusobod 19-dahala', type: 'Avtobus' },
  { id: '2', number: '2', route: 'Eshonqulov - Toshkent vokzali', type: 'Avtobus' },
  { id: '3', number: '14', route: 'Chorsu bozori - TTTU', type: 'Avtobus' },
  { id: '4', number: '24', route: 'Yunusobod - O\'rikzor', type: 'Avtobus' },
  { id: '5', number: '51', route: 'Chilonzor 25-kvartal - Toshkent vokzali', type: 'Avtobus' },
  { id: '6', number: '72', route: 'Mirobod - Qoraqamish 2/4', type: 'Avtobus' },
  { id: '7', number: '93', route: 'Qo\'yliq bozori - Sergeli 7', type: 'Avtobus' },
  { id: '8', number: '110', route: 'TTZ - Oloy bozori', type: 'Avtobus' },
];

export const metroStations = [
  { name: 'Paxtakor', line: 'Chilonzor', status: 'Ishlamoqda' },
  { name: 'Amir Temur xiyoboni', line: 'Chilonzor', status: 'Ishlamoqda' },
  { name: 'Chorsu', line: 'O\'zbekiston', status: 'Ishlamoqda' },
  { name: 'Bodomzor', line: 'Yunusobod', status: 'Ishlamoqda' },
  { name: 'Yunus Rajabiy', line: 'Yunusobod', status: 'Ishlamoqda' },
  { name: 'Buyuk Ipak Yo\'li', line: 'Chilonzor', status: 'Ishlamoqda' },
  { name: 'Olmazor', line: 'Chilonzor', status: 'Ishlamoqda' },
];
