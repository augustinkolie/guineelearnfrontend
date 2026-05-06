'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SummaryView } from '@/components/dashboard/SummaryView';
import { Loader2 } from 'lucide-react';

export default function SummaryPage() {
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
                if (err.message.includes('401')) {
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
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold animate-pulse">Chargement de l'outil de résumé...</p>
            </div>
        );
    }

    const { user, profile } = data;

    return (
        <DashboardLayout user={user}>
            <SummaryView profile={profile} />
        </DashboardLayout>
    );
}
