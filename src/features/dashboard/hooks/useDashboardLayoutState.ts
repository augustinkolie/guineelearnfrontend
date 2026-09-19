'use client';

import { useState, useEffect, useRef } from 'react';
import { apiCall } from '@/utils/api';

export function useDashboardLayoutState(user: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [dueLessonsCount, setDueLessonsCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);

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
        e.stopPropagation();
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

    return {
        isSidebarOpen, setIsSidebarOpen,
        unreadNotifications, notifications,
        isNotifOpen, setIsNotifOpen,
        dueLessonsCount, notifRef,
        handleMarkAllRead, handleDeleteNotification
    };
}
