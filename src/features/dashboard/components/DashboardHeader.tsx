'use client';

import React from 'react';
import { Menu, Search, Bell, Check, Clock, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHeaderProps {
    user: any;
    pathname: string;
    unreadNotifications: number;
    notifications: any[];
    isNotifOpen: boolean;
    notifRef: React.RefObject<HTMLDivElement | null>;
    onOpenSidebar: () => void;
    onToggleNotif: () => void;
    onMarkAllRead: () => void;
    onDeleteNotification: (id: string, e: React.MouseEvent) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    user, pathname, unreadNotifications, notifications, isNotifOpen, notifRef,
    onOpenSidebar, onToggleNotif, onMarkAllRead, onDeleteNotification
}) => {
    if (pathname?.startsWith('/dashboard/messages') || pathname?.startsWith('/dashboard/quiz') || pathname?.startsWith('/dashboard/pedagogical-ai')) {
        return null;
    }

    const isRealtime = pathname?.startsWith('/dashboard/realtime');

    return (
        <header className={`h-20 backdrop-blur-md border-b fixed top-0 right-0 left-0 lg:left-72 z-40 px-4 md:px-8 print:hidden transition-colors duration-500 ${
            isRealtime ? 'bg-[#0A1A11]/80 border-white/5' : 'bg-white/80 border-gray-100'
        }`}>
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onOpenSidebar} className={`p-2 rounded-lg lg:hidden transition-colors ${isRealtime ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-gray-500'}`}>
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className={`hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border w-80 group transition-all ${
                        isRealtime ? 'bg-[#152e20] border-white/10 focus-within:border-emerald-500/50' : 'bg-gray-50 border-gray-100 focus-within:border-[#1B6B3A]/40'
                    }`}>
                        <Search className={`w-4 h-4 ${isRealtime ? 'text-gray-400 group-focus-within:text-emerald-400' : 'text-gray-400 group-focus-within:text-[#1B6B3A]'}`} />
                        <input type="text" placeholder="Rechercher un cours..." className={`bg-transparent border-none outline-none text-sm w-full font-medium ${isRealtime ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`} />
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative" ref={notifRef}>
                        <button onClick={onToggleNotif} className={`relative p-2 rounded-xl transition-all group ${isRealtime ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <Bell className="w-6 h-6 transition-transform group-active:scale-95" />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white text-[10px] font-black leading-none">{unreadNotifications}</span>
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50 origin-top-right">
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                        <h4 className="text-sm font-black text-[#0F2D1E]">Notifications</h4>
                                        {unreadNotifications > 0 && (
                                            <button onClick={onMarkAllRead} className="text-[10px] font-bold text-[#1B6B3A] hover:underline flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Tout marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div key={notif.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group/notif ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}>
                                                    {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B6B3A]" />}
                                                    <div className="pr-6">
                                                        <p className="text-xs font-black text-[#0F2D1E] mb-1">{notif.title}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-2">{notif.message}</p>
                                                        <div className="flex items-center gap-1.5 text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold">{new Date(notif.createdAt).toLocaleDateString()} à {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={(e) => onDeleteNotification(notif.id, e)} className="absolute right-3 top-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all lg:opacity-0 lg:group-hover/notif:opacity-100" title="Supprimer">
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
                            {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className={`text-sm font-medium leading-none mb-1 ${isRealtime ? 'text-white' : 'text-[#0F2D1E]'}`}>{user?.fullName || 'Utilisateur'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
