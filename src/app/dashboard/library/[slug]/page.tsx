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
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch user profile first
                const profileResponse = await apiCall('/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = profileResponse.user;
                setUser(userData);

                // 1. Try to fetch from API as a dynamic resource FIRST
                // We assume slug here is actually the ID for dynamic resources
                try {
                    const dbResource = await apiCall(`/resources/${slug}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const mappedBook: Book = {
                        id: dbResource.id,
                        slug: dbResource.id,
                        title: dbResource.title,
                        author: dbResource.author || 'Inconnu',
                        category: dbResource.subject,
                        level: dbResource.level, // MAPPING LEVEL HERE
                        isPremium: dbResource.isPremium,
                        description: dbResource.description || undefined,
                        publicationDate: new Date(dbResource.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                        rating: 4.5,
                        reviewsCount: 0,
                        pdfUrl: dbResource.url,
                        coverUrl: dbResource.coverUrl,
                        isDynamic: true
                    };

                    if (mappedBook.isPremium && userData.plan !== 'PREMIUM') {
                        router.push('/dashboard/library');
                        return;
                    }

                    setBook(mappedBook);
                } catch (apiErr) {
                    // 2. If not in DB, try to find in static books
                    const staticBook = allBooks.find(b => b.slug === slug);
                    
                    if (staticBook) {
                        if (staticBook.isPremium && userData.plan !== 'PREMIUM') {
                            router.push('/dashboard/library');
                            return;
                        }
                        setBook(staticBook);
                    } else {
                        console.error('Resource not found in DB or static:', apiErr);
                        router.push('/dashboard/library');
                    }
                }
            } catch (err) {
                console.error('Error loading book details:', err);
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
