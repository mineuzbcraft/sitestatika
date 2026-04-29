import { Card } from "@/components/ui/card";
import { Bus, Wrench } from "lucide-react";

export default function ToshBusPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">ToshBus</h1>
        <p className="text-lg text-muted-foreground">Toshkent jamoat transporti yo'nalishlari.</p>
      </div>
      <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <div className="relative flex justify-center items-center">
             <Bus className="mx-auto h-24 w-24 text-accent" />
             <Wrench className="absolute h-10 w-10 text-yellow-400 -bottom-2 -right-2 animate-pulse" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-white">Modul Tez Orada Ishga Tushadi</h2>
          <p className="mt-2 text-muted-foreground max-w-md">"ToshBus" moduli ustida ish olib borilmoqda. Tez orada avtobus va metro yo'nalishlarini qidirish imkoniyati qo'shiladi.</p>
        </div>
      </Card>
    </div>
  );
}
