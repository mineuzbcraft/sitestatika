"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateLetterAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { arizaTypes } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Printer, Wand2 } from 'lucide-react';
import React from 'react';

const arizaSchema = z.object({
  letterType: z.string({ required_error: 'Ariza turini tanlang.' }),
  applicantFullName: z.string().min(1, 'Ism-sharifingizni kiriting.'),
  applicantAddress: z.string().min(1, 'Manzilingizni kiriting.'),
  applicantPhoneNumber: z.string().min(1, 'Telefon raqamingizni kiriting.'),
  applicantEmail: z.string().email('Email manzilingizni to\'g\'ri kiriting.'),
  recipientTitle: z.string().min(1, 'Qabul qiluvchi lavozimini kiriting.'),
  recipientOrganization: z.string().min(1, 'Tashkilot nomini kiriting.'),
  additionalDetails: z.string().optional(),
});

type ArizaFormValues = z.infer<typeof arizaSchema>;

export default function ArizaPage() {
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ArizaFormValues>({
    resolver: zodResolver(arizaSchema),
    defaultValues: {
      letterType: '',
      applicantFullName: '',
      applicantAddress: '',
      applicantPhoneNumber: '',
      applicantEmail: '',
      recipientTitle: '',
      recipientOrganization: '',
      additionalDetails: '',
    },
  });

  const onSubmit = async (data: ArizaFormValues) => {
    setIsLoading(true);
    setGeneratedLetter('');
    const result = await generateLetterAction(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setGeneratedLetter(result.data.generatedLetterContent);
      toast({ title: 'Muvaffaqiyatli', description: 'Arizangiz muvaffaqiyatli yaratildi!' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: result.error || "Arizani yaratishda xatolik yuz berdi.",
      });
    }
  };
  
  const handleCopy = () => {
    if(!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    toast({ title: 'Nusxa olindi', description: 'Ariza matni nusxalandi.' });
  };

  const handlePrint = () => {
    if(!generatedLetter) return;
    const printableArea = document.getElementById('printable');
    if(printableArea) {
      window.print();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Ariza Yaratish</h1>
        <p className="text-lg text-muted-foreground">AI yordamida rasmiy arizalarni osongina yarating.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Ma'lumotlarni kiriting</CardTitle>
            <CardDescription>Kerakli maydonlarni to'ldiring va "Yaratish" tugmasini bosing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="letterType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ariza turi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Ariza turini tanlang" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {arizaTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField control={form.control} name="applicantFullName" render={({ field }) => (<FormItem><FormLabel>F.I.Sh.</FormLabel><FormControl><Input placeholder="Sizning ism sharifingiz" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="applicantPhoneNumber" render={({ field }) => (<FormItem><FormLabel>Telefon raqam</FormLabel><FormControl><Input placeholder="+998 XX XXX XX XX" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                
                 <FormField control={form.control} name="applicantEmail" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="sizning.email@mail.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="applicantAddress" render={({ field }) => (<FormItem><FormLabel>Manzil</FormLabel><FormControl><Input placeholder="Yashash manzilingiz" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="recipientOrganization" render={({ field }) => (<FormItem><FormLabel>Tashkilot</FormLabel><FormControl><Input placeholder="Qabul qiluvchi tashkilot" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="recipientTitle" render={({ field }) => (<FormItem><FormLabel>Lavozim</FormLabel><FormControl><Input placeholder="Qabul qiluvchi lavozimi" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                
                <FormField
                  control={form.control}
                  name="additionalDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qo'shimcha ma'lumotlar</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Arizangiz mazmuniga oid qo'shimcha tafsilotlarni kiriting..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-lg py-6" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                  Yaratish
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Natija</CardTitle>
            <CardDescription>Yaratilgan ariza matni shu yerda ko'rinadi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                </div>
              )}
               <div id="printable" className="prose prose-invert max-w-none rounded-md border bg-black/20 p-4 min-h-[400px] whitespace-pre-wrap">
                  {generatedLetter || "Ariza matni shu yerda paydo bo'ladi..."}
                </div>
                {generatedLetter && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="icon" variant="ghost" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={handlePrint}><Printer className="h-4 w-4" /></Button>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
