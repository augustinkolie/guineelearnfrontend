'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const socials = [
    { icon: Facebook, name: 'facebook' },
    { icon: Twitter, name: 'twitter' },
    { icon: Instagram, name: 'instagram' },
    { icon: Youtube, name: 'youtube' },
];

export const ContactInfoPanel: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-4 p-10 rounded-lg text-white space-y-12 shadow-2xl"
        style={{ backgroundColor: '#1B6B3A' }}
    >
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Adresse</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                    Cité de l&apos;Air, Commune de Matoto<br />
                    Conakry, République de Guinée
                </p>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Contact</h3>
                <p className="text-gray-200 text-sm">
                    <span className="text-white font-bold">Téléphone :</span> +224 620 00 00 00
                </p>
                <p className="text-gray-200 text-sm">
                    <span className="text-white font-bold">Email :</span> contact@guineelearn.com
                </p>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Heures d&apos;ouverture</h3>
                <p className="text-sm text-gray-200">Lundi - Vendredi : 08:00 - 18:00</p>
                <p className="text-sm text-gray-200">Samedi - Dimanche : 09:00 - 15:00</p>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-bold">Suivez-nous</h3>
            <div className="flex flex-wrap gap-4">
                {socials.map(({ icon: Icon, name }) => (
                    <button
                        key={name}
                        style={{ backgroundColor: '#F59E0B' }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-[#0F2D1E] hover:scale-110 transition-all shadow-lg active:scale-95"
                    >
                        <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                ))}
            </div>
        </div>
    </motion.div>
);
