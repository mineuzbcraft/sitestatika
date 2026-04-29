import { Card } from "@/components/ui/card";
import { Gavel } from "lucide-react";

export default function HuquqimPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Huquqim</h1>
        <p className="text-lg text-muted-foreground">Yoshlar huquqlari bo'yicha ma'lumotlar.</p>
      </div>
      <Card className="glass-card flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <Gavel className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-4 text-2xl font-semibold text-white">Huquqim Moduli</h2>
          <p className="mt-2 text-muted-foreground">Bu yerda yoshlar huquqlari haqida ma'lumotlar va qidiruv tizimi bo'ladi.</p>
        </div>
      </Card>
    </div>
  );
}
