"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDoriInfoAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { DoriInfoOutput } from '@/ai/flows/dori-info-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Pill, Search, Info, AlertTriangle, ShieldOff, HeartPulse } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const searchSchema = z.object({
  medicineName: z.string().min(1, 'Iltimos, dori nomini kiriting.'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function DoriInfoPage() {
  const [searchResult, setSearchResult] = useState<DoriInfoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      medicineName: '',
    },
  });

  const onSubmit = async (data: SearchFormValues) => {
    setIsLoading(true);
    setSearchResult(null);
    setHasSearched(true);
    const result = await getDoriInfoAction(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setSearchResult(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: result.error || "Ma'lumotni qidirishda xatolik yuz berdi.",
      });
    }
  };

  const ResultDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground glass-card p-8 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <p className="text-lg">Qidirilmoqda...</p>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center text-muted-foreground glass-card p-8 rounded-lg">
                <Pill className="mx-auto h-16 w-16 text-accent" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Dori-Info Moduli</h2>
                <p className="mt-2">Qidirmoqchi bo'lgan dori nomini kiriting va ma'lumot oling.</p>
            </div>
        );
    }
    
    if (searchResult) {
      return (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-3xl text-accent">{searchResult.name}</CardTitle>
            <CardDescription>{searchResult.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5"/> Qo'llanilishi
                    </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-invert max-w-none">
                  {searchResult.usage}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5"/> Nojo'ya ta'sirlari
                    </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-invert max-w-none">
                  {searchResult.sideEffects}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <ShieldOff className="h-5 w-5"/> Qo'llash mumkin bo'lmagan holatlar
                    </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-invert max-w-none">
                  {searchResult.contraindications}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      );
    }

    return (
        <div className="text-center text-muted-foreground glass-card p-8 rounded-lg">
            <Info className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Ma'lumot topilmadi</h2>
            <p className="mt-2">Boshqa dori nomini qidirib ko'ring.</p>
        </div>
    );
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dori-Info</h1>
        <p className="text-lg text-muted-foreground">Dori-darmonlar haqida sun'iy intellekt yordamida ma'lumot oling.</p>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                control={form.control}
                name="medicineName"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input placeholder="Masalan, 'Paracetamol'" {...field} className="text-lg p-6"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" className="p-6" disabled={isLoading}>
                    <Search className="h-6 w-6"/>
                </Button>
            </form>
        </Form>
      </div>

      <div className="max-w-4xl mx-auto">
        <ResultDisplay />
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
        <AlertTriangle className="inline-block h-4 w-4 mr-2" />
        <span className="font-semibold">Diqqat:</span> Ushbu ma'lumotlar faqat tanishish uchun mo'ljallangan. Har qanday dori vositasini qo'llashdan oldin shifokor yoki farmatsevt bilan maslahatlashing.
      </div>
    </div>
  );
}
