"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProfessionSuggestionAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { KasbimOutput } from '@/ai/flows/kasbim-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Briefcase, Wand2 } from 'lucide-react';

const formSchema = z.object({
  interests: z.string().min(10, 'Qiziqishlaringiz, ko\'nikmalaringiz va xohishlaringizni batafsilroq yozing.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function KasbimPage() {
  const [result, setResult] = useState<KasbimOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    setHasSearched(true);
    const actionResult = await getProfessionSuggestionAction(data);
    setIsLoading(false);

    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
    } else {
      setResult(null);
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: actionResult.error || "Tavsiya olishda xatolik yuz berdi.",
      });
    }
  };

  const ResultDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <p className="text-lg">AI siz uchun kasblarni tahlil qilmoqda...</p>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
                <Briefcase className="mx-auto h-16 w-16 text-accent" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Kasb tanlashga yordam</h2>
                <p className="mt-2 max-w-md">Qiziqishlaringiz va ko'nikmalaringiz haqida yozing, biz sizga mos kasblarni taklif qilamiz.</p>
            </div>
        );
    }
    
    if (result) {
      return (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-accent">Siz uchun tavsiya etilgan kasblar</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="whitespace-pre-wrap text-base prose prose-invert max-w-none">
                {result.suggestion}
             </div>
          </CardContent>
        </Card>
      );
    }

    return (
        <div className="text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
            <Briefcase className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Tavsiya topilmadi</h2>
            <p className="mt-2">Iltimos, o'zingiz haqingizda ko'proq ma'lumot bering.</p>
        </div>
    );
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Kasbim</h1>
        <p className="text-lg text-muted-foreground">O'zingizga mos kasbni AI yordamida toping.</p>
      </div>
      
      <div className="mb-8 max-w-3xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea placeholder="Men kompyuter o'yinlarini o'ynashni, rasm chizishni va matematik masalalarni yechishni yaxshi ko'raman..." {...field} className="text-lg p-6 min-h-[120px]"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                    Tavsiya olish
                </Button>
            </form>
        </Form>
      </div>

      <div className="max-w-4xl mx-auto">
        <ResultDisplay />
      </div>
    </div>
  );
}
