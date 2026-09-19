'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LayoutDashboard, LogOut, Users, Bell } from 'lucide-react';

interface NavMobileOverlayProps {
    isOpen: boolean;
    isLoggedIn: boolean;
    userData: any;
    onClose: () => void;
    onLogout: () => void;
}

export const NavMobileOverlay: React.FC<NavMobileOverlayProps> = ({
    isOpen, isLoggedIn, userData, onClose, onLogout
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl">
                    <div className="p-6 space-y-6">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B6B3A] shadow-sm border border-gray-100">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-[#0F2D1E] truncate">{userData?.fullName}</p>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{userData?.role}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-2 border-b border-gray-50 pb-4">
                                <Link href="/login" onClick={onClose} className="flex items-center justify-center gap-2 w-full py-4 bg-[#1B6B3A] text-white rounded-2xl font-bold shadow-lg shadow-[#1B6B3A]/20">
                                    <User className="w-4 h-4" /> Se Connecter
                                </Link>
                            </div>
                        )}

                        <div className="grid gap-2">
                            {isLoggedIn && (
                                <Link href="/dashboard" onClick={onClose} className="flex items-center gap-4 p-4 rounded-xl text-sm font-bold text-[#1B6B3A] bg-[#E8F5EE] transition-all">
                                    <LayoutDashboard className="w-5 h-5" />
                                    {userData?.role === 'ADMIN' ? 'Espace Administrateur' : userData?.role === 'TEACHER' ? 'Espace Enseignant' : userData?.role === 'PARENT' ? 'Espace Parent' : 'Mon Espace Élève'}
                                </Link>
                            )}
                            <Link href="/about" onClick={onClose} className="flex items-center gap-4 p-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                <Users className="w-5 h-5 opacity-40" /> À Propos
                            </Link>
                            <Link href="/contact" onClick={onClose} className="flex items-center gap-4 p-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                <Bell className="w-5 h-5 opacity-40" /> Contact
                            </Link>
                        </div>

                        {isLoggedIn && (
                            <button onClick={onLogout} className="flex items-center gap-4 w-full p-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-red-100/50">
                                <LogOut className="w-5 h-5" /> Déconnexion
                            </button>
                        )}

                        <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-[0.2em] pt-4">
                            GuinéeLearn • Excellence Éducative
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
