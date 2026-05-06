"use client";

import { Check, User, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const audiences = [
    {
        title: "Pour les Élèves",
        subtitle: "Apprenez à votre rythme avec des cours adaptés à votre niveau",
        image: "/images/students_pro.png",
        icon: <User className="w-5 h-5 text-white" />,
        iconBg: "bg-[#1B6B3A]",
        features: [
            "Accès aux cours par niveau et matière",
            "Quiz d'auto-évaluation",
            "Téléchargement de supports PDF",
            "Suivi de votre progression",
        ],
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
    },
    {
        title: "Pour les Parents",
        subtitle: "Suivez la progression académique de votre enfant en temps réel",
        image: "/images/parents_pro.png",
        icon: <Users className="w-5 h-5 text-white" />,
        iconBg: "bg-[#1B6B3A]",
        features: [
            "Tableau de bord de progression",
            "Alertes pédagogiques",
            "Analyse des forces et faiblesses",
            "Communication avec les enseignants",
        ],
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
    },
    {
        title: "Pour les Enseignants",
        subtitle: "Créez du contenu et suivez vos élèves efficacement",
        image: "/images/teachers_pro.png",
        icon: <GraduationCap className="w-5 h-5 text-white" />,
        iconBg: "bg-[#1B6B3A]",
        features: [
            "Création de cours et quiz",
            "Gestion des contenus pédagogiques",
            "Suivi des élèves",
            "Statistiques détaillées",
        ],
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
    },
];

export const TargetAudience = () => {
    return (
        <section className="bg-white py-12 px-4 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-[2rem] font-extrabold text-[#1A3329] mb-3"
                    >
                        Pour qui ?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-base text-gray-600 max-w-2xl mx-auto"
                    >
                        Une solution adaptée à chaque acteur de l'éducation
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {audiences.map((audience, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-xl shadow-gray-100 border-2 border-transparent hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="relative h-36 w-full">
                                <img
                                    src={audience.image}
                                    alt={audience.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute -bottom-5 left-8 w-10 h-10 ${audience.iconBg} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                                    {audience.icon}
                                </div>
                            </div>

                            <div className="p-4.5 pt-5 flex flex-col flex-grow">
                                <h3 className="text-base font-bold text-[#1A3329] mb-1.5">
                                    {audience.title}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    {audience.subtitle}
                                </p>

                                <ul className="space-y-3 mb-6 flex-grow">
                                    {audience.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3">
                                            <div className="mt-1 bg-green-50 rounded-full p-0.5">
                                                <Check className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3.5 rounded-xl text-white font-bold text-base transition-all transform active:scale-95 shadow-lg ${audience.buttonColor}`}>
                                    Découvrir
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
