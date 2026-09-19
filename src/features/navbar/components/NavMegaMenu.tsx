'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Video, BookOpen, FileText, Users, LineChart, Bell, ShieldCheck, PenTool, BarChart3 } from 'lucide-react';

export const FEATURE_CATEGORIES = [
    {
        title: "Élèves",
        icon: <User className="w-5 h-5" />,
        items: [
            { icon: <Video className="w-4 h-4" />, title: "Cours Vidéos", desc: "Leçons interactives par niveau", href: "/dashboard/courses" },
            { icon: <BookOpen className="w-4 h-4" />, title: "Quiz & Exercices", desc: "S'entraîner sur +10,000 questions", href: "/dashboard/quiz" },
            { icon: <FileText className="w-4 h-4" />, title: "Documents PDF", desc: "Fiches et anciens examens", href: "/dashboard/library" },
        ]
    },
    {
        title: "Parents",
        icon: <Users className="w-5 h-5" />,
        items: [
            { icon: <LineChart className="w-4 h-4" />, title: "Suivi de Progrès", desc: "Visualisez la réussite de l'enfant", href: "/dashboard" },
            { icon: <Bell className="w-4 h-4" />, title: "Alertes SMS", desc: "Notification de performance", href: "/dashboard/settings" },
            { icon: <ShieldCheck className="w-4 h-4" />, title: "Contrôle Parental", desc: "Gérez l'accès aux contenus", href: "/dashboard/settings" },
        ]
    },
    {
        title: "Enseignants",
        icon: <PenTool className="w-4 h-4" />,
        items: [
            { icon: <Users className="w-4 h-4" />, title: "Gestion de Classe", desc: "Suivi individuel et groupé", href: "/dashboard/teacher-students" },
            { icon: <BarChart3 className="w-4 h-4" />, title: "Statistiques", desc: "Analyses détaillées de classe", href: "/dashboard/teacher-stats" },
        ]
    }
];

interface NavMegaMenuProps {
    isOpaque: boolean;
    showMenu: boolean;
    onEnter: () => void;
    onLeave: () => void;
    onClose: () => void;
}

export const NavMegaMenu: React.FC<NavMegaMenuProps> = ({
    isOpaque, showMenu, onEnter, onLeave, onClose
}) => {
    return (
        <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <button className={`flex items-center gap-1.5 transition-colors text-sm font-bold tracking-tight outline-none ${
                isOpaque ? "text-[#0F2D1E] hover:text-[#1B6B3A]" : "text-gray-100 hover:text-white"
            }`}>
                Fonctionnalités
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMenu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] rounded-xl shadow-2xl border overflow-hidden ${
                            isOpaque ? "bg-white border-gray-100" : "bg-[#0F2D1E]/95 backdrop-blur-xl border-white/10"
                        }`}
                    >
                        <div className="grid grid-cols-3 p-2">
                            {FEATURE_CATEGORIES.map((cat) => (
                                <div key={cat.title} className={`p-4 border-r last:border-0 ${
                                    isOpaque ? "border-gray-100" : "border-gray-100/10"
                                }`}>
                                    <div className={`flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.15em] ${
                                        isOpaque ? "text-[#1B6B3A]" : "text-emerald-400"
                                    }`}>
                                        {cat.icon}
                                        {cat.title}
                                    </div>
                                    <div className="space-y-1">
                                        {cat.items.map((item) => (
                                            <Link key={item.title} href={item.href} onClick={onClose}
                                                className={`block p-3 rounded-lg transition-all group ${
                                                    isOpaque ? "hover:bg-gray-50" : "hover:bg-white/10"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`transition-transform group-hover:scale-110 ${
                                                        isOpaque ? "text-gray-400" : "text-white/40"
                                                    }`}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-bold mb-0.5 ${
                                                            isOpaque ? "text-[#0F2D1E]" : "text-white"
                                                        }`}>
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium leading-tight">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`p-4 text-center border-t text-[10px] font-bold uppercase tracking-widest ${
                            isOpaque ? "bg-gray-50 border-gray-100 text-[#1B6B3A]" : "bg-white/5 border-white/10 text-emerald-400"
                        }`}>
                            <Link href="/about" onClick={onClose} className="hover:underline">Découvrir l&apos;écosystème complet GuinéeLearn →</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
