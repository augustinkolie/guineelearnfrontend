'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AboutCtaSection: React.FC = () => (
    <section className="w-full bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 flex justify-center items-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/about_cta_hero.png" alt="Apprenante GuinéeLearn sur mobile" className="w-full max-w-[520px] h-auto object-contain drop-shadow-2xl" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E] leading-[1.15]">
                    Apprenez et progressez avec{' '}
                    <span className="text-[#F59E0B]">GuinéeLearn</span>{' '}
                    facilement en Guinée
                </h2>
                <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                    GuinéeLearn permet d&apos;accéder à des cours vidéos, des quiz et des examens blancs via Orange Money et MTN Mobile Money. Une solution rapide, fiable et conçue spécialement pour les élèves guinéens.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                    <a href="/register" className="inline-flex justify-center items-center px-8 py-3 rounded-full font-bold text-white text-base transition-all hover:bg-[#155c30] active:scale-95"
                        style={{ backgroundColor: '#1B6B3A', boxShadow: '0 4px 20px rgba(27,107,58,0.30)' }}>
                        Commencer maintenant
                    </a>
                    <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm bg-[#0F2D1E] hover:bg-[#1B6B3A] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.18 23.76a2 2 0 0 1-.68-.53 2 2 0 0 1-.5-1.4V2.17A2 2 0 0 1 3.5.3L14.06 12 3.18 23.76zm1.38.24L16.3 13.26l2.84 2.84-11.1 6.41a2.1 2.1 0 0 1-3.48 1.49zM20.56 10.3 17.5 8.5 14.5 12l3 3 3.06-1.8a2 2 0 0 0 0-2.9zM4.56 0 15.67 10.74 12.83 13.5l-2.85-2.84L4.56 0z"/>
                        </svg>
                        <span className="flex flex-col leading-tight text-left">
                            <span className="text-[10px] font-normal opacity-80">DISPONIBLE SUR</span>
                            <span className="text-sm font-bold">Google Play</span>
                        </span>
                    </a>
                </div>
            </motion.div>
        </div>
    </section>
);
