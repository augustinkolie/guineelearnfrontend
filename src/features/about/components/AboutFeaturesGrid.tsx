'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileVideo, FileCheck, ShieldCheck, CloudOff, TrendingUp, Users } from 'lucide-react';

const features = [
    { icon: FileVideo, title: "Cours Vidéos & PDF", desc: "Apprenez avec vos cours préférés partout." },
    { icon: FileCheck, title: "Quiz & Examens Blancs", desc: "Testez vos connaissances en quelques secondes." },
    { icon: ShieldCheck, title: "Qualité Maximale", desc: "Contenus vérifiés par des experts." },
    { icon: CloudOff, title: "Mode Hors-ligne", desc: "Téléchargez pour réviser sans internet." },
    { icon: TrendingUp, title: "Suivi de Progression", desc: "Visualisez vos progrès en temps réel." },
    { icon: Users, title: "Support 24/7", desc: "Assistance pédagogique permanente." },
];

export const AboutFeaturesGrid: React.FC = () => (
    <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="text-center space-y-3 mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E]">
                    Fonctionnalités <span className="text-[#1B6B3A]">GuinéeLearn</span>
                </h2>
                <p className="text-gray-500">Une plateforme éducative moderne conçue pour la Guinée</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-5 rounded-lg border border-gray-200 group hover:border-[#1B6B3A]/40 transition-all"
                    >
                        <div className="w-10 h-10 bg-[#1B6B3A] text-white rounded-lg flex items-center justify-center mb-3">
                            <feat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-[#0F2D1E] mb-1">{feat.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{feat.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
