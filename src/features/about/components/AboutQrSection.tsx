'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const AboutQrSection: React.FC = () => (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E]">
                    Partagez <span className="text-[#1B6B3A]">GuinéeLearn</span>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                    Scannez ce QR code pour accéder instantanément à toutes les informations sur la plateforme. Partagez-le avec vos amis, votre famille ou vos élèves pour les aider à réussir.
                </p>
                <div className="flex items-center gap-4 text-[#1B6B3A] font-bold">
                    <ShieldCheck className="w-6 h-6" />
                    <span>Plateforme certifiée et sécurisée</span>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4 relative group">
                <div className="relative p-4 bg-gray-50 rounded-xl border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fguineelearn.com&color=0F2D1E&bgcolor=F9FAFB`}
                        alt="QR Code GuinéeLearn"
                        className="w-48 h-48"
                    />
                </div>
                <div className="text-center">
                    <p className="text-[#0F2D1E] font-black text-sm uppercase tracking-tighter">Scannez pour découvrir</p>
                    <p className="text-gray-400 text-[10px] font-medium">guineelearn.com</p>
                </div>
            </motion.div>
        </div>
    </section>
);
