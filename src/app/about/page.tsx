'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AboutHero } from '@/features/about/components/AboutHero';
import { AboutCtaSection } from '@/features/about/components/AboutCtaSection';
import { AboutFeatureCards } from '@/features/about/components/AboutFeatureCards';
import { AboutWhySection } from '@/features/about/components/AboutWhySection';
import { AboutFeaturesGrid } from '@/features/about/components/AboutFeaturesGrid';
import { AboutQrSection } from '@/features/about/components/AboutQrSection';

/**
 * AboutPage (Conteneur ultra-léger < 20 lignes)
 * Assemblage pur de sous-composants — aucune logique dans la page.
 */
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar forceOpaque />
            <main className="pt-14">
                <AboutHero />
                <AboutCtaSection />
                <AboutFeatureCards />
                <AboutWhySection />
                <AboutFeaturesGrid />
                <AboutQrSection />
            </main>
            <Footer />
        </div>
    );
}
