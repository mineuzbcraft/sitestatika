import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function KasbimPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Kasbim</h1>
        <p className="text-lg text-muted-foreground">O'zingizga mos kasbni toping.</p>
      </div>
      <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <Briefcase className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-white">Kasbim Moduli</h2>
          <p className="mt-2 text-muted-foreground">Bu yerda kasb tanlash bo'yicha interaktiv test bo'ladi.</p>
        </div>
      </Card>
    </div>
  );
}
