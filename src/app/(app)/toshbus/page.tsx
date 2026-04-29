import { Card } from "@/components/ui/card";
import { Bus } from "lucide-react";

export default function ToshBusPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">ToshBus</h1>
        <p className="text-lg text-muted-foreground">Toshkent jamoat transporti yo'nalishlari.</p>
      </div>
      <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <Bus className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-white">ToshBus Moduli</h2>
          <p className="mt-2 text-muted-foreground">Bu yerda avtobus va metro yo'nalishlarini qidirish funksiyasi bo'ladi.</p>
        </div>
      </Card>
    </div>
  );
}
