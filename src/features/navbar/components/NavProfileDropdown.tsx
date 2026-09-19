'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LayoutDashboard, LogOut } from 'lucide-react';

interface NavProfileDropdownProps {
    isOpaque: boolean;
    isLoggedIn: boolean;
    userData: any;
    showMenu: boolean;
    onToggle: (e: React.MouseEvent) => void;
    onLogout: () => void;
}

export const NavProfileDropdown: React.FC<NavProfileDropdownProps> = ({
    isOpaque, isLoggedIn, userData, showMenu, onToggle, onLogout
}) => {
    if (!isLoggedIn) {
        return (
            <Link href="/login" className={`transition-all text-sm font-medium px-8 py-2.5 rounded-xl border ${
                isOpaque ? "text-[#1B6B3A] border-[#1B6B3A]/20 hover:bg-[#1B6B3A] hover:text-white" : "text-white border-white/30 hover:bg-white/10"
            }`}>
                Connexion
            </Link>
        );
    }

    const roleLabel = userData?.role === 'ADMIN' ? 'Espace Admin' :
        userData?.role === 'TEACHER' ? 'Espace Enseignant' :
        userData?.role === 'PARENT' ? 'Espace Parent' : 'Espace Élève';

    return (
        <div className="flex items-center gap-4">
            <button onClick={onToggle} className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border outline-none ${
                isOpaque ? "bg-transparent border-gray-200 hover:border-[#1B6B3A]/30" : "bg-transparent border-white/20 hover:bg-white/10"
            }`}>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center overflow-hidden transition-all border ${
                    isOpaque ? "bg-[#E8F5EE] border-[#1B6B3A]/10 text-[#1B6B3A]" : "bg-white/10 border-white/20 text-white"
                }`}>
                    <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className={`text-sm font-medium leading-none tracking-tight ${isOpaque ? "text-[#0F2D1E]" : "text-white"}`}>
                        {userData ? userData.fullName : 'Chargement...'}
                    </p>
                </div>
            </button>

            <AnimatePresence>
                {showMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1B6B3A]">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-[#0F2D1E] truncate">{userData?.fullName}</p>
                            </div>
                        </div>

                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#1B6B3A] transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                            </div>
                            {roleLabel}
                        </Link>

                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </div>
                            Déconnexion
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
