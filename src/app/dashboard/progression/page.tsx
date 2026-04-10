'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProgressionView } from '@/components/dashboard/ProgressionView';
import { Loader2 } from 'lucide-react';

export default function ProgressionPage() {
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
                if (err.message.includes('401') || err.message.includes('expired')) {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
                setError("Impossible de charger vos statistiques.");
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
                <p className="text-[#0F2D1E] font-bold animate-pulse">Chargement de votre progression...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-red-50">
                    <h2 className="text-2xl font-black text-red-500 mb-4">Oups !</h2>
                    <p className="text-gray-500 font-medium mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-[#1B6B3A] text-white rounded-xl font-bold shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const { user, profile } = data;

    return (
        <DashboardLayout user={user}>
            <ProgressionView profile={profile} />
        </DashboardLayout>
    );
}
