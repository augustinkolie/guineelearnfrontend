'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    BookOpen, 
    FileText, 
    Calendar, 
    Settings, 
    LogOut, 
    Bell, 
    Search,
    ChevronRight,
    Menu,
    X,
    User,
    Users,
    CheckCircle,
    Activity,
    BarChart3,
    TrendingUp,
    Banknote
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarItemProps {
    icon: any;
    label: string;
    href: string;
    active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
    <Link 
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
            active 
            ? 'bg-[#1B6B3A] text-white shadow-lg shadow-[#1B6B3A]/20' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B6B3A]'
        }`}
    >
        <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-semibold text-sm">{label}</span>
        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </Link>
);

export const DashboardLayout = ({ children, user }: { children: React.ReactNode, user: any }) => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
        { icon: User, label: 'Mon Profil', href: '/dashboard/profile' },
        ...(user?.role === 'ADMIN' ? [
            { icon: Users, label: 'Gestion Utilisateurs', href: '/dashboard/users' },
            { icon: BookOpen, label: 'Contenu & Cours', href: '/dashboard/admin-courses' },
            { icon: BarChart3, label: 'Statistiques', href: '/dashboard/stats' },
            { icon: Banknote, label: 'Finance', href: '/dashboard/finance' },
            { icon: Activity, label: 'Temps réel', href: '/dashboard/realtime' },
        ] : [
            { icon: BookOpen, label: 'Mes Cours', href: '/dashboard/courses' },
            { icon: CheckCircle, label: 'Quiz', href: '/dashboard/quiz' },
            { icon: TrendingUp, label: 'Progression', href: '/dashboard/progression' },
            { icon: FileText, label: 'Mes Ressources', href: '/dashboard/resources' },
            { icon: Calendar, label: 'Calendrier', href: '/dashboard/calendar' },
        ])
    ];

    return (
        <div className={`min-h-screen flex font-sans ${pathname?.startsWith('/dashboard/realtime') ? 'bg-black' : 'bg-[#F8FAFC]'}`}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0F2D1E] border-r border-white/5 z-50 print:hidden
                transition-transform duration-300 lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Subtle Decorative Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-[#1B6B3A]/10 to-transparent pointer-events-none" />

                <div className="relative flex flex-col h-full p-6">
                    <div className="mb-10 px-2">
                        {/* Logo on Dark Background */}
                        <Link href="/" className="block filter brightness-0 invert opacity-100 hover:opacity-80 transition-opacity">
                            <Logo scrolled={true} height="h-10" />
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-1.5">
                        {menuItems.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                    pathname === item.href
                                    ? 'bg-[#1B6B3A] text-white shadow-xl shadow-[#1B6B3A]/20' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-semibold text-sm">{item.label}</span>
                                {pathname === item.href && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-100/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold text-sm group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className={`h-20 backdrop-blur-md border-b fixed top-0 right-0 left-0 lg:left-72 z-40 px-4 md:px-8 print:hidden transition-colors duration-500 overflow-hidden ${
                    pathname?.startsWith('/dashboard/realtime') 
                    ? 'bg-[#0A1A11]/80 border-white/5' 
                    : 'bg-white/80 border-gray-100'
                }`}>
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className={`p-2 rounded-lg lg:hidden transition-colors ${pathname?.startsWith('/dashboard/realtime') ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-gray-500'}`}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            
                            <div className={`hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border w-80 group transition-all ${
                                pathname?.startsWith('/dashboard/realtime') 
                                ? 'bg-[#152e20] border-white/10 focus-within:border-emerald-500/50' 
                                : 'bg-gray-50 border-gray-100 focus-within:border-[#1B6B3A]/40'
                            }`}>
                                <Search className={`w-4 h-4 ${pathname?.startsWith('/dashboard/realtime') ? 'text-gray-400 group-focus-within:text-emerald-400' : 'text-gray-400 group-focus-within:text-[#1B6B3A]'}`} />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un cours..." 
                                    className={`bg-transparent border-none outline-none text-sm w-full font-medium ${pathname?.startsWith('/dashboard/realtime') ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6">
                            <button className={`relative p-2 rounded-xl transition-all group ${
                                pathname?.startsWith('/dashboard/realtime') 
                                ? 'text-gray-400 hover:bg-white/5' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}>
                                <Bell className="w-6 h-6 transition-transform group-active:scale-95" />
                                {/* Notification Badge with Counter */}
                                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                                    <span className="text-white text-[10px] font-black leading-none">3</span>
                                </span>
                            </button>

                            <div className="h-8 w-px bg-gray-100" />

                            <div className="flex items-center gap-3 pl-2">
                                <div className="h-10 w-10 rounded-full bg-[#E8F5EE] border-2 border-white shadow-sm flex items-center justify-center text-[#1B6B3A] overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className={`text-sm font-medium leading-none mb-1 ${pathname?.startsWith('/dashboard/realtime') ? 'text-white' : 'text-[#0F2D1E]'}`}>{user?.fullName || 'Utilisateur'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className={`flex-1 overflow-y-auto print:p-0 print:overflow-visible ${pathname?.startsWith('/dashboard/realtime') ? 'bg-black pt-20' : 'p-4 md:p-8 lg:p-10 pt-24 md:pt-28 lg:pt-32'}`}>
                    <div className={pathname?.startsWith('/dashboard/realtime') ? 'w-full min-h-[calc(100vh-5rem)]' : 'max-w-7xl mx-auto'}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
