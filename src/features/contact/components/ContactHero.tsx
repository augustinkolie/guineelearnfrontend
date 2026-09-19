'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const ContactHero: React.FC = () => (
    <section className="pt-40 pb-24 relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
            <img
                src="/assets/images/contact-bg.png"
                alt="Background"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0F2D1E]/75" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black mb-6"
            >
                Parlons de votre <span className="text-green-400">avenir</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-300 max-w-2xl mx-auto font-light"
            >
                Une question sur nos cours ? Besoin d&apos;assistance ? Notre équipe est là pour vous accompagner dans votre réussite.
            </motion.p>
        </div>
    </section>
);
