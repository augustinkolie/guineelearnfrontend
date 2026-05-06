'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MessagesView } from '@/components/dashboard/MessagesView';
import { Loader2 } from 'lucide-react';

export default function MessagesPage() {
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
                    return;
                }
                setError("Impossible de charger les données de messagerie.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#111B21] gap-4">
                <Loader2 className="w-12 h-12 text-[#00A884] animate-spin" />
                <p className="text-[#8696A0] font-bold animate-pulse tracking-widest uppercase text-xs">Ouverture de vos discussions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#111B21]">
                <div className="bg-[#202C33] p-8 rounded-3xl shadow-xl text-center max-w-md border border-[#2A3942]">
                    <h2 className="text-2xl font-black text-red-400 mb-4">Erreur</h2>
                    <p className="text-[#8696A0] font-medium mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-[#00A884] text-white rounded-xl font-bold">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout user={data.user}>
            <MessagesView />
        </DashboardLayout>
    );
}
