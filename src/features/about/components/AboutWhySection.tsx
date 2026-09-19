'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: "Préfectures supportées", value: "33+" },
    { label: "Utilisateurs actifs", value: "10 000+" },
    { label: "Satisfaction élèves %", value: "99" },
    { label: "Support académique 24/7", value: "24" },
];

export const AboutWhySection: React.FC = () => (
    <section className="bg-[#0B130E] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-16">
            <div className="flex flex-col lg:flex-row items-start gap-16">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 flex justify-center items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/about_why.png" alt="Pourquoi choisir GuinéeLearn" className="w-full max-w-[520px] h-auto object-contain drop-shadow-2xl" style={{ borderRadius: 8 }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: 1 }} className="self-start pt-4">
                    <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-6">
                        Pourquoi choisir <span className="text-[#1B6B3A]">GuinéeLearn</span>
                    </h2>
                    <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                        <p>GuinéeLearn est une solution innovante conçue pour offrir aux élèves guinéens une expérience d&apos;apprentissage rapide, fiable et accessible.</p>
                        <p>Nous avons intégré des fonctionnalités essentielles telles que la consultation hors-ligne des cours, des évaluations interactives et un suivi de progression en temps réel.</p>
                        <p>Avec le soutien des meilleurs enseignants et des méthodes pédagogiques modernes, GuinéeLearn s&apos;engage à transformer chaque obstacle en une opportunité de réussite.</p>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                    <p className="text-4xl font-black text-[#1B6B3A] mb-2">{stat.value}</p>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    </section>
);
