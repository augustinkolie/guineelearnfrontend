'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { BookDetailView } from '@/components/dashboard/BookDetailView';
import { allBooks, Book } from '@/constants/books';
import { Loader2 } from 'lucide-react';

export default function BookPage() {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAccessAndLoad = async () => {
            const slug = params.slug as string;
            const foundBook = allBooks.find(b => b.slug === slug);

            if (!foundBook) {
                router.push('/dashboard/library');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await apiCall('/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = response.user;
                setUser(userData);

                // Access Control
                if (foundBook.isPremium && userData.plan !== 'PREMIUM') {
                    // Redirect free users away from premium books
                    router.push('/dashboard/library');
                    return;
                }

                setBook(foundBook);
            } catch (err) {
                console.error(err);
                router.push('/dashboard/library');
            } finally {
                setIsLoading(false);
            }
        };

        checkAccessAndLoad();
    }, [params, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold">Chargement des détails...</p>
            </div>
        );
    }

    if (!book || !user) return null;

    return (
        <DashboardLayout user={user}>
            <div className="bg-white -m-4 md:-m-8 lg:-m-10">
                <BookDetailView book={book} user={user} />
            </div>
        </DashboardLayout>
    );
}
