'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

export const AboutHero: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 100, mass: 1 };
    const xSpring = useSpring(mouseX, springConfig);
    const ySpring = useSpring(mouseY, springConfig);
    const velocityX = useVelocity(xSpring);
    const velocityY = useVelocity(ySpring);
    const scale = useTransform([velocityX, velocityY], ([vX, vY]: any[]) => {
        const speed = Math.sqrt(Math.pow(Number(vX), 2) + Math.pow(Number(vY), 2));
        return 1 + Math.min(speed / 2000, 0.15);
    });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <section onMouseMove={handleMouseMove} className="group relative w-full pt-0 pb-8 overflow-hidden border-b border-gray-50 transition-colors duration-500">
            <motion.div className="absolute inset-0 z-0 opacity-[0.55]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%231B6B3A'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    x: useTransform(xSpring, x => (x - 600) / 40),
                    y: useTransform(ySpring, y => (y - 300) / 40),
                    scale: 1.05,
                }}
            />
            <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ x: xSpring, y: ySpring, translateX: '-50%', translateY: '-50%', scale, width: '1000px', height: '1000px', left: 0, top: 0, background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-20">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-6">
                    <h1 className="text-3xl lg:text-4xl font-black text-[#0F2D1E] leading-[1.1]">
                        Qu&apos;est-ce que <span className="text-[#1B6B3A]">Guin&eacute;eLearn</span> ?
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                        GuinéeLearn est une plateforme éducative innovante conçue pour offrir aux élèves guinéens un accès simple, rapide et sécurisé à des contenus pédagogiques de qualité, adaptés aux réalités du pays.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex-1 flex justify-center items-end">
                    <div className="relative" style={{ width: 540, height: 600 }}>
                        <div className="absolute rounded-full bg-[#1B6B3A]/15 border-[3px] border-[#1B6B3A]/30" style={{ width: 440, height: 440, bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
                        <div className="absolute rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]" style={{ width: 460, height: 460, bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/about_hero.png" alt="Étudiant GuinéeLearn" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
