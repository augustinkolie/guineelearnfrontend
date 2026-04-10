"use client";

import { Book, MessageSquare, FileText, LineChart, Compass, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
    {
        title: "Cours complets",
        description: "Contenus pédagogiques du primaire au lycée.",
        icon: <Book className="w-5 h-5" />,
    },
    {
        title: "Quiz interactifs",
        description: "Évaluations avec corrections instantanées.",
        icon: <MessageSquare className="w-5 h-5" />,
    },
    {
        title: "Bibliothèque PDF",
        description: "Annales, manuels et fiches de révision.",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        title: "Suivi de progression",
        description: "Tableaux de bord pour élèves et parents.",
        icon: <LineChart className="w-5 h-5" />,
    },
    {
        title: "Orientation",
        description: "Conseils pour votre avenir académique.",
        icon: <Compass className="w-5 h-5" />,
    },
    {
        title: "Mobile-first",
        description: "Apprentissage fluide sur smartphone.",
        icon: <Smartphone className="w-5 h-5" />,
    },
];

export const Features = () => {
    return (
        <section className="bg-[#F8FAFC]/60 py-24 px-4 md:px-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#E8F5EE]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-[2rem] font-extrabold text-[#1A3329] mb-3"
                    >
                        Tout pour votre réussite scolaire.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-base text-gray-600 max-w-2xl mx-auto"
                    >
                        Accédez à tout le nécessaire pour transformer votre parcours éducatif avec des ressources modernes et un accompagnement personnalisé.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
                    {/* Left: Professional Image with decorative card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="w-full lg:w-1/2 relative group"
                    >
                        <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden shadow-2xl" style={{ clipPath: "url(#featuresBlob)" }}>
                            <Image
                                src="/assets/images/features-pro.png"
                                alt="Étudiant professionnel guinéen"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D1E]/40 to-transparent opacity-60" />
                        </div>
                        
                        {/* Perfect Professional Blob Mask for Features */}
                        <svg width="0" height="0" className="absolute">
                            <defs>
                                <clipPath id="featuresBlob" clipPathUnits="objectBoundingBox">
                                    <path d="M0,0.2 L0.25,0 L1,0.15 L1,0.8 L0.75,1 L0,0.85 Z" />
                                </clipPath>
                            </defs>
                        </svg>
                        

                    </motion.div>

                    {/* Right: Feature Grid beside the image */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-start">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#1B6B3A]/30 hover:shadow-xl hover:shadow-[#1B6B3A]/5 transition-all group flex flex-col h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#F4F6F5] text-[#1B6B3A] group-hover:bg-[#1B6B3A] group-hover:text-white transition-colors flex items-center justify-center mb-5 shrink-0 border border-gray-100/50">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1A3329] mb-2 group-hover:text-[#1B6B3A] transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

