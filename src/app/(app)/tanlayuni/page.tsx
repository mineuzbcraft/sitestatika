"use client";

import { useState } from 'react';
import Image from 'next/image';
import { universitySubjects, universities, University } from '@/lib/data';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { School, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TanlayUniPage() {
  const [score, setScore] = useState([100]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filteredUnis, setFilteredUnis] = useState<University[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleSearch = () => {
    setHasSearched(true);
    const results = universities.filter(uni => {
      const scoreMatch = uni.minScore <= score[0];
      const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.every(sub => uni.subjects.includes(sub));
      return scoreMatch && subjectMatch;
    });
    setFilteredUnis(results);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">TanlayUni</h1>
        <p className="text-lg text-muted-foreground">O'zingizga mos universitetni oson toping!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle>Filtrlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="dtm-score" className="text-base">DTM balingiz: <span className="font-bold text-accent">{score[0]}</span></Label>
                <Slider
                  id="dtm-score"
                  min={50}
                  max={189}
                  step={1}
                  value={score}
                  onValueChange={setScore}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-base">Fanlar</Label>
                <div className="mt-2 space-y-2">
                  {universitySubjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => handleSubjectChange(subject)}
                      />
                      <Label htmlFor={subject} className="font-normal text-gray-300">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Qidirish
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!hasSearched ? (
            <Card className="glass-card flex h-96 w-full items-center justify-center">
              <div className="text-center">
                <School className="mx-auto h-16 w-16 text-accent" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Universitetlarni toping</h2>
                <p className="mt-2 text-muted-foreground">Filtrlarni tanlang va "Qidirish" tugmasini bosing.</p>
              </div>
            </Card>
          ) : filteredUnis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUnis.map(uni => (
                <Card key={uni.name} className="glass-card overflow-hidden">
                  <div className="relative h-40 w-full">
                      <Image src={uni.imageUrl} alt={uni.name} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle>{uni.name}</CardTitle>
                    <CardDescription>Minimal o'tish bali: <span className="font-bold text-accent">{uni.minScore}</span></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">{uni.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {uni.subjects.map(sub => (
                            <Badge key={sub} variant="secondary">{sub}</Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card flex h-96 w-full items-center justify-center">
              <div className="text-center">
                <School className="mx-auto h-16 w-16 text-primary" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Hech narsa topilmadi</h2>
                <p className="mt-2 text-muted-foreground">Filtrlarni o'zgartirib, qayta urinib ko'ring.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
