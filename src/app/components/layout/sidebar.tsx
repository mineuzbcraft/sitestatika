"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/data';
import { useContext } from 'react';
import { AuthContext } from '@/app/context/auth-provider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

const SidebarContent = () => {
    const pathname = usePathname();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.email === 'admin@fuqaro.uz';

    return (
        <div className="flex h-full flex-col p-4">
            <div className="mb-8 flex items-center gap-3 px-2">
                <HardHat className="h-8 w-8 text-accent" />
                <h1 className="text-2xl font-bold text-white">Fuqaro<span className="text-accent">Portal</span></h1>
            </div>
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-primary/20 hover:text-white",
                                isActive && "bg-primary/30 text-white font-semibold"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default function Sidebar() {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-shrink-0 md:block">
                <div className="fixed flex h-full w-64 flex-col border-r border-white/10 bg-black/20">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-sm">
                            <PanelLeft className="h-5 w-5 text-white" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 border-r-0 bg-gray-900/90 p-0 backdrop-blur-lg">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
