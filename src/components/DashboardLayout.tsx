'use client';

import React, { useState, useEffect } from 'react';
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
    Banknote,
    LifeBuoy,
    Handshake,
    Library,
    Check,
    Clock,
    Trash2,
    GraduationCap,
    PlusCircle,
    Radio,
    Sparkles,
    FileSearch
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { apiCall } from '@/utils/api';

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
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [dueLessonsCount, setDueLessonsCount] = useState(0);
    const notifRef = React.useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const data = await apiCall('/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(data);
            setUnreadNotifications(data.filter((n: any) => !n.isRead).length);
        } catch (err) {
            console.error("Notifications fetch error", err);
        }
    };

    const fetchDueLessonsCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || user?.role !== 'STUDENT') return;
            const data = await apiCall(`/lesson-progress/due/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDueLessonsCount(data.length);
        } catch (err) {
            console.error("Due lessons fetch error", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchDueLessonsCount();
            const interval = setInterval(() => {
                fetchNotifications();
                fetchDueLessonsCount();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Handle click outside to close notifications
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };

        if (isNotifOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotifOpen]);

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await apiCall('/notifications/read-all', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Error marking all read", err);
        }
    };

    const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid closing dropdown if clicking delete
        try {
            const token = localStorage.getItem('token');
            await apiCall(`/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Error deleting notification", err);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
        { icon: User, label: 'Mon Profil', href: '/dashboard/profile' },
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
            { icon: BarChart3, label: 'Statistiques', href: '/dashboard/teacher-stats' },
            { icon: LifeBuoy, label: 'Support', href: '/dashboard/support' },
        ] : [
            { icon: BookOpen, label: 'Mes Cours', href: '/dashboard/courses' },
            { icon: CheckCircle, label: 'Quiz', href: '/dashboard/quiz' },
            { icon: Sparkles, label: 'Révisions', href: '/dashboard/review' },
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
        <div className={`flex font-sans ${pathname?.startsWith('/dashboard/messages') ? 'h-screen overflow-hidden' : 'min-h-screen'} ${pathname?.startsWith('/dashboard/realtime') ? 'bg-black' : 'bg-[#F8FAFC]'}`}>
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

                    <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                                    pathname === item.href
                                    ? 'bg-[#1B6B3A] text-white' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}>
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
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${pathname?.startsWith('/dashboard/messages') ? 'h-screen' : ''}`}>
                {/* Header - Hidden in Messages and Quiz Tabs */}
                {!(pathname?.startsWith('/dashboard/messages') || pathname?.startsWith('/dashboard/quiz')) && (
                    <header className={`h-20 backdrop-blur-md border-b fixed top-0 right-0 left-0 lg:left-72 z-40 px-4 md:px-8 print:hidden transition-colors duration-500 ${
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
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className={`relative p-2 rounded-xl transition-all group ${
                                    pathname?.startsWith('/dashboard/realtime') 
                                    ? 'text-gray-400 hover:bg-white/5' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}>
                                    <Bell className="w-6 h-6 transition-transform group-active:scale-95" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white text-[10px] font-black leading-none">{unreadNotifications}</span>
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                                        >
                                                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                                    <h4 className="text-sm font-black text-[#0F2D1E]">Notifications</h4>
                                                    {unreadNotifications > 0 && (
                                                        <button 
                                                            onClick={handleMarkAllRead}
                                                            className="text-[10px] font-bold text-[#1B6B3A] hover:underline flex items-center gap-1"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Tout marquer comme lu
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((notif) => (
                                                            <div 
                                                                key={notif.id} 
                                                                className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group/notif ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}
                                                            >
                                                                {!notif.isRead && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B6B3A]" />
                                                                )}
                                                                <div className="pr-6"> {/* Reserve space for trash icon */}
                                                                    <p className="text-xs font-black text-[#0F2D1E] mb-1">{notif.title}</p>
                                                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-2">{notif.message}</p>
                                                                    <div className="flex items-center gap-1.5 text-gray-400">
                                                                        <Clock className="w-3 h-3" />
                                                                        <span className="text-[9px] font-bold">
                                                                            {new Date(notif.createdAt).toLocaleDateString()} à {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Delete Button - Visible on hover or small screens */}
                                                                <button 
                                                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                                    className="absolute right-3 top-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all lg:opacity-0 lg:group-hover/notif:opacity-100"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-10 text-center">
                                                            <Bell className="w-10 h-10 text-gray-100 mx-auto mb-3" />
                                                            <p className="text-xs font-bold text-gray-400">Aucune notification pour le moment</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

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
                )}

                {/* Page Content */}
                <main className={`flex-1 flex flex-col print:p-0 print:overflow-visible ${
                    (pathname?.startsWith('/dashboard') && 
                     user?.role === 'STUDENT' && 
                     !pathname?.startsWith('/dashboard/realtime') && 
                     !pathname?.startsWith('/dashboard/messages')) 
                    ? 'grid-background' : ''
                } ${
                    pathname?.startsWith('/dashboard/realtime') 
                    ? 'bg-black pt-20' 
                    : pathname?.startsWith('/dashboard/messages')
                    ? 'bg-[#111B21] h-screen flex flex-col overflow-hidden'
                    : pathname?.startsWith('/dashboard/quiz')
                    ? 'bg-[#F8FAFC] h-screen flex flex-col overflow-hidden'
                    : 'p-4 md:p-8 lg:p-10 pt-24 md:pt-28 lg:pt-32 overflow-y-auto'
                }`}>
                    <div className={
                        pathname?.startsWith('/dashboard/realtime') 
                        ? 'w-full flex-1 flex flex-col min-h-0' 
                        : (pathname?.startsWith('/dashboard/messages') || pathname?.startsWith('/dashboard/quiz'))
                        ? 'w-full h-full flex-1 flex flex-col min-h-0'
                        : 'max-w-7xl mx-auto w-full'
                    }>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
