'use client';

import React from 'react';
import Link from 'next/link';
import { 
    LayoutDashboard, BookOpen, FileText, Calendar, Settings, LogOut, 
    ChevronRight, Users, CheckCircle, Activity, BarChart3, TrendingUp, 
    Banknote, LifeBuoy, Handshake, Library, GraduationCap, PlusCircle, 
    Radio, FileSearch, Brain, Bot 
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Logo } from '@/components/Logo';

interface DashboardSidebarProps {
    user: any;
    pathname: string;
    isSidebarOpen: boolean;
    unreadNotifications: number;
    dueLessonsCount: number;
    onCloseSidebar: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    user, pathname, isSidebarOpen, unreadNotifications, dueLessonsCount, onCloseSidebar
}) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
        { icon: Users, label: 'Mon Profil', href: '/dashboard/profile' },
        ...(user?.role === 'ADMIN' ? [
            { icon: Users, label: 'Gestion Utilisateurs', href: '/dashboard/users' },
            { icon: BookOpen, label: 'Contenu & Cours', href: '/dashboard/admin-courses' },
            { icon: Library, label: 'Gestion Bibliothèque', href: '/dashboard/admin-library' },
            { icon: FaWhatsapp, label: 'Messages', href: '/dashboard/messages' },
            { icon: Radio, label: 'Direct (Live)', href: '/dashboard/live' },
            { icon: BarChart3, label: 'Statistiques', href: '/dashboard/stats' },
            { icon: Banknote, label: 'Finance', href: '/dashboard/finance' },
            { icon: Activity, label: 'Temps réel', href: '/dashboard/realtime' },
            { icon: Settings, label: 'Configuration', href: '/dashboard/admin-system' },
            { icon: LifeBuoy, label: 'Support', href: '/dashboard/support' },
            { icon: Handshake, label: 'Partenariats', href: '/dashboard/partners' },
        ] : user?.role === 'TEACHER' ? [
            { icon: PlusCircle, label: 'Cours & Quiz', href: '/dashboard/teacher-courses' },
            { icon: Radio, label: 'Direct (Live)', href: '/dashboard/live' },
            { icon: Library, label: 'Bibliothèque', href: '/dashboard/teacher-content' },
            { icon: GraduationCap, label: 'Suivi Élèves', href: '/dashboard/teacher-students' },
            { icon: FaWhatsapp, label: 'Messages', href: '/dashboard/messages' },
            { icon: Bot, label: 'Assistant Pédagogique', href: '/dashboard/pedagogical-ai' },
            { icon: BarChart3, label: 'Statistiques', href: '/dashboard/teacher-stats' },
            { icon: LifeBuoy, label: 'Support', href: '/dashboard/support' },
        ] : [
            { icon: BookOpen, label: 'Mes Cours', href: '/dashboard/courses' },
            { icon: CheckCircle, label: 'Quiz', href: '/dashboard/quiz' },
            { icon: Brain, label: 'Révisions', href: '/dashboard/review' },
            { icon: Bot, label: 'Assistant Pédagogique', href: '/dashboard/pedagogical-ai' },
            { icon: Library, label: 'Bibliothèque', href: '/dashboard/library' },
            { icon: FileSearch, label: 'Résumé', href: '/dashboard/summary' },
            { icon: TrendingUp, label: 'Progression', href: '/dashboard/progression' },
            { icon: FileText, label: 'Mes Ressources', href: '/dashboard/resources' },
            { icon: Calendar, label: 'Calendrier', href: '/dashboard/calendar' },
            { icon: FaWhatsapp, label: 'Messages', href: '/dashboard/messages' },
            { icon: LifeBuoy, label: 'Support', href: '/dashboard/support' },
        ])
    ];

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={onCloseSidebar} />
            )}

            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0F2D1E] border-r border-white/5 z-50 print:hidden transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-linear-to-b from-[#1B6B3A]/10 to-transparent pointer-events-none" />
                <div className="relative flex flex-col h-full p-6">
                    <div className="mb-10 px-2">
                        <Link href="/" className="block filter brightness-0 invert opacity-100 hover:opacity-80 transition-opacity">
                            <Logo scrolled={true} height="h-10" />
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${pathname === item.href ? 'bg-[#1B6B3A] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-semibold text-sm">{item.label}</span>
                                {item.label === 'Support' && unreadNotifications > 0 && (
                                    <span className="absolute right-12 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                                )}
                                {item.label === 'Révisions' && dueLessonsCount > 0 && (
                                    <span className="absolute right-12 top-1/2 -translate-y-1/2 min-w-[18px] h-[18px] px-1 bg-[#FF3B30] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                                        {dueLessonsCount}
                                    </span>
                                )}
                                {pathname === item.href && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-100/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold text-sm group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
