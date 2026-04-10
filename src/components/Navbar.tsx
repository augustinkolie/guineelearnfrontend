"use client";

import { Logo } from "./Logo";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    User, 
    LayoutDashboard, 
    LogOut, 
    X, 
    ChevronDown, 
    Video, 
    BookOpen, 
    FileText, 
    LineChart, 
    ShieldCheck, 
    Bell,
    Users,
    PenTool,
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "@/utils/api";

// Feature Menu Data
const FEATURE_CATEGORIES = [
    {
        title: "Élèves",
        icon: <User className="w-5 h-5" />,
        items: [
            { icon: <Video className="w-4 h-4" />, title: "Cours Vidéos", desc: "Leçons interactives par niveau" },
            { icon: <BookOpen className="w-4 h-4" />, title: "Quiz & Exercices", desc: "S'entraîner sur +10,000 questions" },
            { icon: <FileText className="w-4 h-4" />, title: "Documents PDF", desc: "Fiches et anciens examens" },
        ]
    },
    {
        title: "Parents",
        icon: <Users className="w-5 h-5" />,
        items: [
            { icon: <LineChart className="w-4 h-4" />, title: "Suivi de Progrès", desc: "Visualisez la réussite de l'enfant" },
            { icon: <Bell className="w-4 h-4" />, title: "Alertes SMS", desc: "Notification de performance" },
            { icon: <ShieldCheck className="w-4 h-4" />, title: "Contrôle Parental", desc: "Gérez l'accès aux contenus" },
        ]
    },
    {
        title: "Enseignants",
        icon: <PenTool className="w-4 h-4" />,
        items: [
            { icon: <Users className="w-4 h-4" />, title: "Gestion de Classe", desc: "Suivi individuel et groupé" },
            { icon: <BarChart3 className="w-4 h-4" />, title: "Statistiques", desc: "Analyses détaillées de classe" },
        ]
    }
];

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    // To prevent immediate closing when moving mouse
    const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMenuEnter = () => {
        if (menuTimeout) clearTimeout(menuTimeout);
        setShowFeaturesMenu(true);
    };

    const handleMenuLeave = () => {
        const timeout = setTimeout(() => setShowFeaturesMenu(false), 200);
        setMenuTimeout(timeout);
    };
    
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        
        // Check for token and fetch profile
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchProfile(token);
        }

        // Close menu on click outside
        const handleClickOutside = () => {
            setShowProfileMenu(false);
            setShowFeaturesMenu(false);
        };
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const data = await apiCall('/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUserData(data.user);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white py-1.5 shadow-lg" : "bg-transparent py-2.5"
            }`}>
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <Logo scrolled={scrolled} height="h-12" />

                <div className="hidden md:flex items-center gap-6">
                    {/* FEATURES MEGAMENU TRIGGER */}
                    <div 
                        className="relative"
                        onMouseEnter={handleMenuEnter}
                        onMouseLeave={handleMenuLeave}
                    >
                        <button 
                            className={`flex items-center gap-1.5 transition-colors text-sm font-bold tracking-tight outline-none ${
                                scrolled ? "text-[#0F2D1E] hover:text-[#1B6B3A]" : "text-gray-100 hover:text-white"
                            }`}
                        >
                            Fonctionnalités
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFeaturesMenu ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {showFeaturesMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] rounded-xl shadow-2xl border overflow-hidden ${
                                        scrolled ? "bg-white border-gray-100" : "bg-[#0F2D1E]/95 backdrop-blur-xl border-white/10"
                                    }`}
                                >
                                    <div className="grid grid-cols-3 p-2">
                                        {FEATURE_CATEGORIES.map((cat) => (
                                            <div key={cat.title} className="p-4 border-r last:border-0 border-gray-100/10">
                                                <div className={`flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.15em] ${
                                                    scrolled ? "text-[#1B6B3A]" : "text-emerald-400"
                                                }`}>
                                                    {cat.icon}
                                                    {cat.title}
                                                </div>
                                                <div className="space-y-1">
                                                    {cat.items.map((item) => (
                                                        <Link 
                                                            key={item.title}
                                                            href="#"
                                                            className={`block p-3 rounded-lg transition-all group ${
                                                                scrolled 
                                                                ? "hover:bg-gray-50" 
                                                                : "hover:bg-white/10"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`transition-transform group-hover:scale-110 ${
                                                                    scrolled ? "text-gray-400" : "text-white/40"
                                                                }`}>
                                                                    {item.icon}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-xs font-bold mb-0.5 ${
                                                                        scrolled ? "text-[#0F2D1E]" : "text-white"
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
                                        scrolled ? "bg-gray-50 border-gray-100 text-[#1B6B3A]" : "bg-white/5 border-white/10 text-emerald-400"
                                    }`}>
                                        <Link href="#" className="hover:underline">Découvrir l'écosystème complet GuinéeLearn →</Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/contact" className={`transition-colors text-sm font-bold tracking-tight ${scrolled ? "text-[#0F2D1E] hover:text-[#1B6B3A]" : "text-gray-100 hover:text-white"}`}>Contact</Link>
                    
                    <div className="relative">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                {/* Profile Dropdown Trigger */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowProfileMenu(!showProfileMenu);
                                    }}
                                    className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border outline-none ${
                                        scrolled 
                                        ? "bg-transparent border-gray-200 hover:border-[#1B6B3A]/30" 
                                        : "bg-transparent border-white/20 hover:bg-white/10"
                                    }`}
                                >
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center overflow-hidden transition-all border ${
                                        scrolled 
                                        ? "bg-[#E8F5EE] border-[#1B6B3A]/10 text-[#1B6B3A]" 
                                        : "bg-white/10 border-white/20 text-white"
                                    }`}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-medium leading-none tracking-tight ${scrolled ? "text-[#0F2D1E]" : "text-white"}`}>
                                            {userData ? userData.fullName : 'Chargement...'}
                                        </p>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                                        >
                                            {/* Mon Profil */}
                                            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 mb-1">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1B6B3A]">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-[#0F2D1E] truncate">{userData?.fullName}</p>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <Link 
                                                href="/dashboard" 
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#1B6B3A] transition-colors">
                                                    <LayoutDashboard className="w-4 h-4" />
                                                </div>
                                                Espace Élève
                                            </Link>

                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors">
                                                    <LogOut className="w-4 h-4" />
                                                </div>
                                                Déconnexion
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className={`transition-all text-sm font-medium px-8 py-2.5 rounded-xl border ${
                                    scrolled 
                                    ? "text-[#1B6B3A] border-[#1B6B3A]/20 hover:bg-[#1B6B3A] hover:text-white" 
                                    : "text-white border-white/30 hover:bg-white/10"
                                }`}
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
