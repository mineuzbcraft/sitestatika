"use client";

import { useState } from 'react';
import { busRoutes, metroStations } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, MapPin, Search, TrainFront } from "lucide-react";
import { Badge } from '@/components/ui/badge';

export default function ToshBusPage() {
  const [searchBus, setSearchBus] = useState('');
  const [searchMetro, setSearchMetro] = useState('');

  const filteredBuses = busRoutes.filter(bus => 
    bus.number.includes(searchBus) || bus.route.toLowerCase().includes(searchBus.toLowerCase())
  );

  const filteredMetro = metroStations.filter(station => 
    station.name.toLowerCase().includes(searchMetro.toLowerCase()) || station.line.toLowerCase().includes(searchMetro.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">ToshBus</h1>
        <p className="text-lg text-muted-foreground">Toshkent jamoat transporti: avtobus va metro yo'nalishlari.</p>
      </div>

      <Tabs defaultValue="bus" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-black/20">
          <TabsTrigger value="bus" className="flex items-center gap-2">
            <Bus className="h-4 w-4" />
            Avtobuslar
          </TabsTrigger>
          <TabsTrigger value="metro" className="flex items-center gap-2">
            <TrainFront className="h-4 w-4" />
            Metro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bus">
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>Avtobus yo'nalishlari</CardTitle>
              <CardDescription>Raqami yoki yo'nalishi bo'yicha qidiring.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Masalan: 51 yoki Chorsu" 
                  value={searchBus}
                  onChange={(e) => setSearchBus(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBuses.length > 0 ? (
                  filteredBuses.map(bus => (
                    <Card key={bus.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-lg font-bold py-1 px-3 border-accent text-accent">
                            {bus.number}-yo'nalish
                          </Badge>
                          <Bus className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm font-medium text-gray-200">{bus.route}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Hech qanday avtobus topilmadi.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metro">
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>Metro bekatlari</CardTitle>
              <CardDescription>Bekat nomi yoki yo'nalish (liniya) bo'yicha qidiring.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Masalan: Paxtakor yoki Chilonzor" 
                  value={searchMetro}
                  onChange={(e) => setSearchMetro(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMetro.length > 0 ? (
                  filteredMetro.map((station, idx) => (
                    <Card key={idx} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{station.name}</CardTitle>
                          <MapPin className="h-5 w-5 text-accent" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Yo'nalish:</span>
                           <Badge className={station.line === 'Chilonzor' ? 'bg-red-500' : station.line === 'O\'zbekiston' ? 'bg-blue-500' : 'bg-green-500'}>
                             {station.line}
                           </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Status:</span>
                           <span className="text-xs text-green-400 font-semibold">{station.status}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Hech qanday metro bekati topilmadi.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
