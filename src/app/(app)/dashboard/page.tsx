"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Users, FileText, AlertTriangle, PenTool, Loader2 } from 'lucide-react'
import { useState, useEffect } from "react"

const chartData = [
  { name: 'DoriInfo', usage: 400 },
  { name: 'ToshBus', usage: 300 },
  { name: 'Ariza', usage: 900 },
  { name: 'TanlayUni', usage: 600 },
  { name: 'Huquqim', usage: 200 },
  { name: 'Mahalla', usage: 500 },
  { name: 'Kasbim', usage: 700 },
];

const finalStats = {
  users: { count: 1257, change: 20.1 },
  applications: { count: 345, change: 12.4 },
  issues: { count: 89, open: 12 },
  tests: { count: 2103 },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      users: { count: 0, change: 0 },
      applications: { count: 0, change: 0 },
      issues: { count: 0, open: 0 },
      tests: { count: 0 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(finalStats);
      setLoading(false);
    }, 1200); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, icon: Icon, value, subtext, isLoading }: {title: string, icon: React.ElementType, value: string | number, subtext: string, isLoading: boolean}) => (
      <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
            <Icon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="h-12 flex items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-accent"/>
                </div>
            ) : (
                <>
                    <div className="text-3xl font-bold text-white">{value}</div>
                    <p className="text-xs text-muted-foreground">{subtext}</p>
                </>
            )}
          </CardContent>
        </Card>
  )

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Boshqaruv paneli</h1>
        <p className="text-lg text-muted-foreground">Portal faoliyati bo'yicha umumiy statistika.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Foydalanuvchilar"
            icon={Users}
            value={stats.users.count.toLocaleString()}
            subtext={`+${stats.users.change}% o'tgan oydan`}
            isLoading={loading}
        />
        <StatCard 
            title="Tushgan arizalar"
            icon={FileText}
            value={stats.applications.count.toLocaleString()}
            subtext={`+${stats.applications.change}% o'tgan haftadan`}
            isLoading={loading}
        />
        <StatCard 
            title="Muammolar"
            icon={AlertTriangle}
            value={stats.issues.count}
            subtext={`${stats.issues.open} tasi ko'rib chiqilmoqda`}
            isLoading={loading}
        />
        <StatCard 
            title="Kasb testlari"
            icon={PenTool}
            value={stats.tests.count.toLocaleString()}
            subtext="Topshirilgan testlar soni"
            isLoading={loading}
        />
      </div>

      <div className="mt-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Modullar bo'yicha foydalanish</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
          {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
              </div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(123, 47, 247, 0.2)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderColor: '#7b2ff7'
                  }}
                />
                <Bar dataKey="usage" fill="#00f5ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
