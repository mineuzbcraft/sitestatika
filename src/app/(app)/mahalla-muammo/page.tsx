import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MahallaMuammoPage() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'tashkent-map');

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Mahalla Muammo</h1>
        <p className="text-lg text-muted-foreground">Mahallangizdagi muammolar haqida xabar bering.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card h-[600px]">
            <CardHeader>
              <CardTitle>Toshkent Xaritasi</CardTitle>
            </CardHeader>
            <CardContent>
              {mapImage && (
                <Image 
                  src={mapImage.imageUrl} 
                  alt={mapImage.description}
                  data-ai-hint={mapImage.imageHint}
                  width={800}
                  height={600}
                  className="rounded-lg object-cover w-full h-[500px]"
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Muammo haqida xabar berish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="district">Tuman</Label>
                <Select>
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Tumanni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chilonzor">Chilonzor</SelectItem>
                    <SelectItem value="yunusobod">Yunusobod</SelectItem>
                    <SelectItem value="mirobod">Mirobod</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="problem-type">Muammo turi</Label>
                <Select>
                  <SelectTrigger id="problem-type">
                    <SelectValue placeholder="Muammo turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Yo'l</SelectItem>
                    <SelectItem value="garbage">Chiqindi</SelectItem>
                    <SelectItem value="electricity">Elektr energiyasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Tavsif</Label>
                <Textarea id="description" placeholder="Muammoni batafsil tavsiflang..." />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/80">Yuborish</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
