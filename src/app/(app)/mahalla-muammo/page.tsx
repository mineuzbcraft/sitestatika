"use client";

import { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

import { AuthContext } from '@/app/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { tashkentDistricts, problemTypes } from '@/lib/data';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const problemSchema = z.object({
  district: z.string().min(1, 'Tumanni tanlang.'),
  problemType: z.string().min(1, 'Muammo turini tanlang.'),
  description: z.string().min(10, 'Muammoni batafsilroq yozing (kamida 10 belgi).'),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

export type Problem = {
  id: string;
  district: string;
  type: string;
  description: string;
  status: 'Yangi' | 'Ko\'rib chiqilmoqda' | 'Hal qilindi';
  submittedAt: string;
  user: string;
};

export default function MahallaMuammoPage() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'tashkent-map');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const isAdmin = user?.email === 'admin@fuqaro.uz';

  useEffect(() => {
    // This is to avoid hydration errors
    setLoading(true);
    try {
      const storedProblems = localStorage.getItem('fp_problems');
      if (storedProblems) {
        setProblems(JSON.parse(storedProblems));
      }
    } catch (error) {
      console.error("Failed to parse problems from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: { district: '', problemType: '', description: '' },
  });

  const onSubmit = (data: ProblemFormValues) => {
    if (!user) return;
    const newProblem: Problem = {
      id: uuidv4(),
      district: data.district,
      type: data.problemType,
      description: data.description,
      status: 'Yangi',
      submittedAt: new Date().toISOString(),
      user: user.fullName,
    };
    const updatedProblems = [newProblem, ...problems];
    setProblems(updatedProblems);
    localStorage.setItem('fp_problems', JSON.stringify(updatedProblems));
    toast({ title: 'Muvaffaqiyatli!', description: 'Muammo haqidagi xabaringiz qabul qilindi.' });
    form.reset();
  };

  const handleStatusChange = (problemId: string, newStatus: Problem['status']) => {
    const updatedProblems = problems.map(p =>
      p.id === problemId ? { ...p, status: newStatus } : p
    );
    setProblems(updatedProblems);
    localStorage.setItem('fp_problems', JSON.stringify(updatedProblems));
    toast({ title: 'Status yangilandi', description: `Muammo statusi "${newStatus}" ga o'zgartirildi.` });
  };
  
  const StatusBadge = ({ status }: { status: Problem['status'] }) => {
    const baseClasses = "font-semibold";
    switch (status) {
        case 'Yangi':
            return <Badge variant="secondary" className={baseClasses}>{status}</Badge>;
        case 'Ko\'rib chiqilmoqda':
            return <Badge variant="default" className={`${baseClasses} bg-primary/80`}>{status}</Badge>;
        case 'Hal qilindi':
            return <Badge className={`${baseClasses} bg-accent/80 text-accent-foreground border-accent`}>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Mahalla Muammo</h1>
        <p className="text-lg text-muted-foreground">Mahallangizdagi muammolar haqida xabar bering va ularning yechimini kuzatib boring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card">
                <CardHeader>
                <CardTitle>Xabar qilingan muammolar</CardTitle>
                <CardDescription>Mavjud muammolar ro'yxati va ularning holati.</CardDescription>
                </CardHeader>
                <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
                ) : problems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Hozircha xabar qilingan muammolar mavjud emas.</p>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {problems.map(p => (
                        <Card key={p.id} className="bg-black/20">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                <CardTitle className="text-lg">{p.type}</CardTitle>
                                <CardDescription>{p.district} tumani</CardDescription>
                                </div>
                                <StatusBadge status={p.status}/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-300">{p.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{p.user} tomonidan · {formatDistanceToNow(new Date(p.submittedAt), { addSuffix: true, locale: uz })}</span>
                            {isAdmin && (
                            <Select value={p.status} onValueChange={(value: Problem['status']) => handleStatusChange(p.id, value)}>
                                <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="Yangi">Yangi</SelectItem>
                                <SelectItem value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</SelectItem>
                                <SelectItem value="Hal qilindi">Hal qilindi</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                )}
                </CardContent>
            </Card>
            <Card className="glass-card h-[500px]">
                <CardHeader>
                    <CardTitle>Muammolar Xaritasi</CardTitle>
                </CardHeader>
                <CardContent className="h-full pb-6">
                    <div className="relative h-full w-full">
                        {mapImage && (
                        <Image 
                            src={mapImage.imageUrl} 
                            alt={mapImage.description}
                            data-ai-hint={mapImage.imageHint}
                            fill
                            className="rounded-lg object-cover"
                        />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
                <CardHeader>
                    <CardTitle>Muammo haqida xabar berish</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tuman</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Tumanni tanlang" /></SelectTrigger></FormControl>
                            <SelectContent>{tashkentDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <FormField control={form.control} name="problemType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Muammo turi</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Muammo turini tanlang" /></SelectTrigger></FormControl>
                            <SelectContent>{problemTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tavsif</FormLabel>
                            <FormControl><Textarea placeholder="Muammoni batafsil tavsiflang..." {...field} rows={4} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={form.formState.isSubmitting}>Yuborish</Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
