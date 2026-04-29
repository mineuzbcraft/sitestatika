import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";

export default function DoriInfoPage() {
  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dori-Info</h1>
        <p className="text-lg text-muted-foreground">Dori-darmonlar haqida ma'lumotlar bazasi.</p>
      </div>
       <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <Pill className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-white">Dori-Info Moduli</h2>
          <p className="mt-2 text-muted-foreground">Bu yerda dori-darmonlarni qidirish funksiyasi bo'ladi.</p>
        </div>
      </Card>
    </div>
  );
}
