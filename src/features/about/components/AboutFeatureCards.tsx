'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, CreditCard } from 'lucide-react';

const features = [
    { icon: CreditCard, title: "Paiements locaux intégrés", desc: "Payez vos abonnements facilement avec Orange Money et Mobile Money. Plus besoin de carte bancaire internationale." },
    { icon: Smartphone, title: "Simple et accessible", desc: "Une interface intuitive conçue pour tous. Que vous soyez débutant ou expert, GuinéeLearn vous permet d'apprendre facilement." },
    { icon: ShieldCheck, title: "Qualité maximale", desc: "Vos contenus sont validés par les meilleurs enseignants. GuinéeLearn garantit la pertinence et la qualité de vos cours." },
];

export const AboutFeatureCards: React.FC = () => (
    <section className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="text-center space-y-3 mb-10">
                <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E]">
                    Une plateforme conçue pour la <span className="text-[#1B6B3A]">Guinée</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    GuinéeLearn a été créée pour répondre aux réalités locales, en offrant une solution simple, sécurisée et parfaitement adaptée aux besoins des élèves.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-lg border border-gray-200 text-center group hover:border-[#1B6B3A]/30 transition-colors"
                    >
                        <div className="w-11 h-11 bg-[#1B6B3A] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-[#0F2D1E] mb-3">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
