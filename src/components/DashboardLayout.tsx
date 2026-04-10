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
    CheckCircle,
    Activity,
    BarChart3
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
        { icon: BookOpen, label: 'Mes Cours', href: '/dashboard/courses' },
        { icon: CheckCircle, label: 'Quiz', href: '/dashboard/quiz' },
        { icon: Activity, label: 'Progression', href: '/dashboard/progression' },
        { icon: FileText, label: 'Mes Ressources', href: '/dashboard/resources' },
        { icon: Calendar, label: 'Calendrier', href: '/dashboard/calendar' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0F2D1E] border-r border-white/5 z-50 
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
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 right-0 left-0 lg:left-72 z-40 px-4 md:px-8">
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 hover:bg-gray-50 rounded-lg lg:hidden text-gray-500"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            
                            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-80 group focus-within:border-[#1B6B3A]/40 transition-all">
                                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#1B6B3A]" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un cours..." 
                                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6">
                            <button className="relative p-2.5 text-gray-500 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-xl transition-all group border border-transparent hover:border-[#1B6B3A]/10">
                                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                {/* Pulsing Badge Indicator */}
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white"></span>
                                </span>
                                
                                {/* Elegant Counter Badge */}
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm scale-0 group-hover:scale-110 transition-transform">
                                    3
                                </div>
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
                                    <p className="text-sm font-medium text-[#0F2D1E] leading-none mb-1">{user?.fullName || 'Utilisateur'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pt-24 md:pt-28 lg:pt-32">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
