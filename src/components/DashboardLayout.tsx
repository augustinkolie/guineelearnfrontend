'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CallProvider } from '@/context/CallContext';
import { useDashboardLayoutState } from '@/features/dashboard/hooks/useDashboardLayoutState';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';

/**
 * DashboardLayout (Conteneur ultra-léger < 60 lignes)
 * Conforme aux principes SOLID & GoF.
 */
export const DashboardLayout = ({ children, user }: { children: React.ReactNode, user: any }) => {
    const pathname = usePathname();
    const {
        isSidebarOpen, setIsSidebarOpen,
        unreadNotifications, notifications,
        isNotifOpen, setIsNotifOpen,
        dueLessonsCount, notifRef,
        handleMarkAllRead, handleDeleteNotification
    } = useDashboardLayoutState(user);

    const isMessages = pathname?.startsWith('/dashboard/messages');
    const isRealtime = pathname?.startsWith('/dashboard/realtime');
    const isQuiz = pathname?.startsWith('/dashboard/quiz');
    const isPedagogicalAi = pathname?.startsWith('/dashboard/pedagogical-ai');
    const isProfile = pathname?.startsWith('/dashboard/profile');

    return (
        <CallProvider userId={user.id} userName={user.fullName}>
            <div className={`flex font-sans ${isMessages ? 'h-screen overflow-hidden' : 'min-h-screen'} ${isRealtime ? 'bg-black' : isProfile ? 'bg-[#F3F2EF]' : 'bg-[#F8FAFC]'}`}>
                <DashboardSidebar
                    user={user}
                    pathname={pathname || ''}
                    isSidebarOpen={isSidebarOpen}
                    unreadNotifications={unreadNotifications}
                    dueLessonsCount={dueLessonsCount}
                    onCloseSidebar={() => setIsSidebarOpen(false)}
                />

                <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${isMessages ? 'h-screen' : ''}`}>
                    <DashboardHeader
                        user={user}
                        pathname={pathname || ''}
                        unreadNotifications={unreadNotifications}
                        notifications={notifications}
                        isNotifOpen={isNotifOpen}
                        notifRef={notifRef}
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        onToggleNotif={() => setIsNotifOpen(!isNotifOpen)}
                        onMarkAllRead={handleMarkAllRead}
                        onDeleteNotification={handleDeleteNotification}
                    />

                    <main className={`flex-1 flex flex-col print:p-0 print:overflow-visible ${
                        (pathname?.startsWith('/dashboard') && user?.role === 'STUDENT' && !isRealtime && !isMessages && !isProfile) ? 'grid-background' : ''
                    } ${
                        isRealtime ? 'bg-black pt-20' 
                        : isMessages ? 'bg-[#111B21] h-screen flex flex-col overflow-hidden'
                        : isQuiz ? 'bg-[#F8FAFC] h-screen flex flex-col overflow-hidden'
                        : isPedagogicalAi ? 'bg-white h-screen flex flex-col overflow-hidden !p-0'
                        : isProfile ? 'bg-[#F3F2EF] p-2.5 sm:p-4 md:p-5 lg:p-6 pt-20 sm:pt-24 md:pt-24 lg:pt-24 overflow-y-auto'
                        : 'p-4 md:p-8 lg:p-10 pt-24 md:pt-28 lg:pt-32 overflow-y-auto'
                    }`}>
                        <div className={isRealtime ? 'w-full flex-1 flex flex-col min-h-0' : (isMessages || isQuiz || isPedagogicalAi) ? 'w-full h-full flex-1 flex flex-col min-h-0' : 'max-w-7xl mx-auto w-full'}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </CallProvider>
    );
};
