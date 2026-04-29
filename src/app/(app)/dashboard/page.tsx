"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Users, FileText, AlertTriangle, PenTool } from 'lucide-react'

const chartData = [
  { name: 'DoriInfo', usage: 400 },
  { name: 'ToshBus', usage: 300 },
  { name: 'Ariza', usage: 900 },
  { name: 'TanlayUni', usage: 600 },
  { name: 'Huquqim', usage: 200 },
  { name: 'Mahalla', usage: 500 },
  { name: 'Kasbim', usage: 700 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Boshqaruv paneli</h1>
        <p className="text-lg text-muted-foreground">Portal faoliyati bo'yicha umumiy statistika.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Foydalanuvchilar</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,257</div>
            <p className="text-xs text-muted-foreground">+20.1% o'tgan oydan</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Tushgan arizalar</CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">345</div>
            <p className="text-xs text-muted-foreground">+12.4% o'tgan haftadan</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Muammolar</CardTitle>
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">89</div>
            <p className="text-xs text-muted-foreground">12 tasi ko'rib chiqilmoqda</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Kasb testlari</CardTitle>
            <PenTool className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">2,103</div>
            <p className="text-xs text-muted-foreground">Topshirilgan testlar soni</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Modullar bo'yicha foydalanish</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
