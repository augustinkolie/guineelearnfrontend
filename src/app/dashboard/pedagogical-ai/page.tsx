'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PedagogicalAI } from '@/components/dashboard/PedagogicalAI';
import { Loader2 } from 'lucide-react';

export default function PedagogicalAIPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                router.push('/login');
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
                <p className="text-[#0F2D1E] font-bold">Chargement de votre assistant...</p>
            </div>
        );
    }

    const { user } = data;

    return (
        <DashboardLayout user={user}>
            <PedagogicalAI />
        </DashboardLayout>
    );
}
