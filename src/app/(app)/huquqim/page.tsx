"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { askQuestionAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { HuquqimQuestionOutput } from '@/ai/flows/huquqim-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Gavel, Send } from 'lucide-react';

const searchSchema = z.object({
  question: z.string().min(5, 'Savol kamida 5 ta belgidan iborat bo\'lishi kerak.'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function HuquqimPage() {
  const [result, setResult] = useState<HuquqimQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = async (data: SearchFormValues) => {
    setIsLoading(true);
    setResult(null);
    setHasSearched(true);
    const actionResult = await askQuestionAction(data);
    setIsLoading(false);

    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
    } else {
      setResult(null);
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: actionResult.error || "Savolga javob olishda xatolik yuz berdi.",
      });
    }
  };

  const ResultDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <p className="text-lg">AI javob tayyorlamoqda...</p>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
                <Gavel className="mx-auto h-16 w-16 text-accent" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Huquqiy maslahatchi</h2>
                <p className="mt-2">O'zbekiston qonunchiligi bo'yicha savolingizni bering.</p>
            </div>
        );
    }
    
    if (result) {
      return (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-accent">AI Mutaxassis Javobi</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="whitespace-pre-wrap text-base prose prose-invert max-w-none">
                {result.answer}
             </div>
          </CardContent>
        </Card>
      );
    }

    return (
        <div className="text-center text-muted-foreground glass-card p-8 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
            <Gavel className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Javob topilmadi</h2>
            <p className="mt-2">Savolingizni boshqacha tarzda berib ko'ring.</p>
        </div>
    );
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Huquqim</h1>
        <p className="text-lg text-muted-foreground">Yoshlar huquqlari bo'yicha sun'iy intellekt maslahatchisi.</p>
      </div>
      
      <div className="mb-8 max-w-3xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea placeholder="Masalan: 'Mehnat shartnomasini bekor qilish tartibi qanday?'" {...field} className="text-lg p-6 min-h-[100px]"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Javob olish
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
