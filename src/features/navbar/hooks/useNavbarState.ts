'use client';

import { useState, useEffect } from 'react';
import { apiCall } from '@/utils/api';

export function useNavbarState() {
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchProfile(token);
        }

        const handleClickOutside = () => {
            setShowProfileMenu(false);
            setShowFeaturesMenu(false);
            setIsMobileMenuOpen(false);
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

    return {
        scrolled,
        showProfileMenu, setShowProfileMenu,
        showFeaturesMenu, setShowFeaturesMenu,
        isLoggedIn, userData,
        isMobileMenuOpen, setIsMobileMenuOpen,
        handleMenuEnter, handleMenuLeave,
        handleLogout
    };
}
