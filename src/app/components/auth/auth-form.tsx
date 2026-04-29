"use client";

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthContext } from '@/app/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2, UserPlus, LogIn, HardHat } from 'lucide-react';
import { tashkentDistricts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email manzilni to\'g\'ri kiriting' }),
  password: z.string().min(1, { message: 'Parolni kiriting' }),
});

const registerSchema = z
  .object({
    fullName: z.string().min(3, { message: 'Ism-sharif kamida 3 belgidan iborat bo\'lishi kerak' }),
    email: z.string().email({ message: 'Email manzilni to\'g\'ri kiriting' }),
    phone: z.string().regex(/^\+998 \d{2} \d{3} \d{2} \d{2}$/, { message: 'Telefon raqamini to\'g\'ri kiriting (+998 XX XXX XX XX)' }),
    district: z.string().min(1, { message: 'Tumanni tanlang' }),
    password: z.string()
      .min(8, { message: 'Parol kamida 8 belgidan iborat bo\'lishi kerak' })
      .regex(/[A-Z]/, { message: 'Parolda kamida bitta katta harf bo\'lishi kerak' })
      .regex(/[0-9]/, { message: 'Parolda kamida bitta raqam bo\'lishi kerak' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parollar mos kelmadi',
    path: ['confirmPassword'],
  });

export type User = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const { login, register } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '+998 ',
      district: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    if (values.email === 'admin@fuqaro.uz' && values.password === 'Admin123!') {
      login({ ...values, fullName: 'Admin', district: 'Toshkent', phone: '' });
    } else {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('fp_users') || '[]');
      const foundUser = existingUsers.find(u => u.email === values.email && u.password === values.password);
      if (foundUser) {
        login(foundUser);
      } else {
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Email yoki parol noto'g'ri.",
        });
      }
    }
    setIsSubmitting(false);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    register(values);
    setIsSubmitting(false);
    registerForm.reset();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value.startsWith('998')) {
        value = '998' + value.substring(3);
    }
    value = value.substring(0, 12); // 998 + 9 digits
    
    let formattedValue = "+";
    if (value.length > 0) formattedValue += value.substring(0, 3);
    if (value.length > 3) formattedValue += " " + value.substring(3, 5);
    if (value.length > 5) formattedValue += " " + value.substring(5, 8);
    if (value.length > 8) formattedValue += " " + value.substring(8, 10);
    if (value.length > 10) formattedValue += " " + value.substring(10, 12);
    
    registerForm.setValue('phone', formattedValue);
  };


  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <HardHat className="w-10 h-10 text-accent"/>
                Fuqaro<span className="text-accent">Portal</span>
            </h1>
        </div>
        <Card className="glass-card-form">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-2">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary/30 data-[state=active]:text-white">Kirish</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary/30 data-[state=active]:text-white">Ro'yxatdan o'tish</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 p-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@fuqaro.uz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parol</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Kirish
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 p-6">
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ism-sharif</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@fuqaro.uz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon raqami</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={handlePhoneChange}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={registerForm.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuman</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tumaningizni tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tashkentDistricts.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parol</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parolni tasdiqlang</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/80" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Ro'yxatdan o'tish
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
