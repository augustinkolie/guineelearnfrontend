'use client';

import React from 'react';
import { Logo } from '@/components/Logo';

const stats = [
    { value: '388 +', label: 'Utilisateurs' },
    { value: '150 +', label: 'Cours' },
    { value: '12 +', label: 'Villes' },
];

export const LoginHeroPanel: React.FC = () => (
    <div className="hidden lg:flex w-[60%] relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src="/assets/images/login-bg.png"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background"
        />
        <div className="absolute inset-0 bg-[#0F2D1E]/75" />

        <div className="relative z-10 w-full h-full flex flex-col p-16 justify-between text-white">
            <div className="flex items-center gap-4">
                <Logo scrolled={false} height="h-[42px]" />
            </div>

            <div className="max-w-xl">
                <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                    Trouvez le bon cours, <br /> au bon moment.
                </h1>
                <p className="text-xl opacity-90 leading-relaxed font-light">
                    Connectez-vous à l&apos;avenir de l&apos;éducation en Guinée, intelligemment et durablement.
                </p>
            </div>

            <div className="flex gap-16 items-end">
                {stats.map(({ value, label }) => (
                    <div key={label} className="space-y-1">
                        <span className="text-3xl font-bold block">{value}</span>
                        <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
