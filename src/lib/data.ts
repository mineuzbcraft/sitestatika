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
