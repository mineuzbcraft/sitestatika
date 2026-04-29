import { Card } from "@/components/ui/card";
import { School } from "lucide-react";

export default function TanlayUniPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">TanlayUni</h1>
        <p className="text-lg text-muted-foreground">Universitetlarni qidirish va tanlash tizimi.</p>
      </div>
      <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <School className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-white">TanlayUni Moduli</h2>
          <p className="mt-2 text-muted-foreground">Bu yerda fanlar va DTM bali bo'yicha universitet topish funksiyasi bo'ladi.</p>
        </div>
      </Card>
    </div>
  );
}
