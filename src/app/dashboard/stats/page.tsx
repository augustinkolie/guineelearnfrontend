'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AdminStatsView } from '@/components/dashboard/AdminStatsView';
import { Loader2 } from 'lucide-react';

export default function StatsPage() {
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
                
                if (response.user.role !== 'ADMIN') {
                    router.push('/dashboard');
                    return;
                }

                setData(response);
            } catch (err: any) {
                console.error(err);
                if (err.message.includes('401') || err.message.includes('expired')) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }
                setError("Impossible de charger les données administrateur.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold animate-pulse">Analyse des données en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-red-50">
                    <h2 className="text-2xl font-black text-red-500 mb-4">Erreur</h2>
                    <p className="text-gray-500 font-medium mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-[#1B6B3A] text-white rounded-xl font-bold">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout user={data.user}>
            <AdminStatsView user={data.user} />
        </DashboardLayout>
    );
}
