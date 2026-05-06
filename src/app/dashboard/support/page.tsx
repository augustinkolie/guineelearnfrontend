'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AdminSupportView } from '@/components/dashboard/AdminSupportView';
import { StudentSupportView } from '@/components/dashboard/StudentSupportView';
import { Loader2 } from 'lucide-react';

export default function SupportPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiCall('/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setData(response);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold animate-pulse">Chargement du Centre de Support...</p>
            </div>
        );
    }

    return (
        <DashboardLayout user={data.user}>
            {data.user.role === 'ADMIN' ? (
                <AdminSupportView user={data.user} />
            ) : (
                <StudentSupportView user={data.user} />
            )}
        </DashboardLayout>
    );
}
