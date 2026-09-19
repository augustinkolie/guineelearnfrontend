"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, X, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { useNavbarState } from "@/features/navbar/hooks/useNavbarState";
import { NavMegaMenu } from "@/features/navbar/components/NavMegaMenu";
import { NavProfileDropdown } from "@/features/navbar/components/NavProfileDropdown";
import { NavMobileOverlay } from "@/features/navbar/components/NavMobileOverlay";

/**
 * Navbar (Conteneur ultra-léger < 70 lignes)
 * Conforme SOLID: SRP, ISP, DIP.
 */
export const Navbar = ({ forceOpaque = false }: { forceOpaque?: boolean }) => {
    const {
        scrolled,
        showProfileMenu, setShowProfileMenu,
        showFeaturesMenu, setShowFeaturesMenu,
        isLoggedIn, userData,
        isMobileMenuOpen, setIsMobileMenuOpen,
        handleMenuEnter, handleMenuLeave,
        handleLogout,
    } = useNavbarState();

    const isOpaque = scrolled || forceOpaque;
    const linkCls = `transition-colors text-sm font-bold tracking-tight ${
        isOpaque ? "text-[#0F2D1E] hover:text-[#1B6B3A]" : "text-gray-100 hover:text-white"
    }`;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isOpaque ? "bg-white py-1.5 shadow-lg" : "bg-transparent py-2.5"}`}>
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <Logo scrolled={isOpaque} height="h-12" />

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-6">
                    <NavMegaMenu
                        isOpaque={isOpaque}
                        showMenu={showFeaturesMenu}
                        onEnter={handleMenuEnter}
                        onLeave={handleMenuLeave}
                        onClose={() => setShowFeaturesMenu(false)}
                    />
                    <Link href="/about" className={linkCls}>À Propos</Link>
                    <Link href="/contact" className={linkCls}>Contact</Link>

                    <div className="relative">
                        <NavProfileDropdown
                            isOpaque={isOpaque}
                            isLoggedIn={isLoggedIn}
                            userData={userData}
                            showMenu={showProfileMenu}
                            onToggle={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <div className="md:hidden flex items-center gap-4">
                    {isLoggedIn && (
                        <Link href="/dashboard" className={`p-2 rounded-xl border transition-all ${
                            isOpaque ? "bg-[#E8F5EE] border-[#1B6B3A]/10 text-[#1B6B3A]" : "bg-white/10 border-white/20 text-white"
                        }`}>
                            <LayoutDashboard className="w-5 h-5" />
                        </Link>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                        className={`p-2 rounded-xl transition-colors ${isOpaque ? "text-[#0F2D1E] hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE NAVIGATION OVERLAY */}
            <NavMobileOverlay
                isOpen={isMobileMenuOpen}
                isLoggedIn={isLoggedIn}
                userData={userData}
                onClose={() => setIsMobileMenuOpen(false)}
                onLogout={handleLogout}
            />
        </nav>
    );
};
