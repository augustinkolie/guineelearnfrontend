'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TeacherStatsView } from '@/components/dashboard/TeacherStatsView';
import { Loader2 } from 'lucide-react';

export default function TeacherStatsPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await apiCall('/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response);
            } catch (err: any) {
                console.error(err);
                if (err.message.includes('401') || err.message.includes('expired') || err.message.includes('not found') || err.message.includes('404')) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }
                setError("Impossible de charger le profil.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                    <div className="absolute inset-0 bg-green-100/20 blur-xl -z-10" />
                </div>
                <p className="text-[#0F2D1E] font-bold animate-pulse">Chargement de vos statistiques...</p>
            </div>
        );
    }

    const { user } = data;

    return (
        <DashboardLayout user={user}>
            <TeacherStatsView />
        </DashboardLayout>
    );
}
