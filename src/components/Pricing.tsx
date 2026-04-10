"use client";

import { Check, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: "Gratuit",
        price: "0",
        period: "Toujours gratuit",
        description: "Pour commencer votre apprentissage",
        features: [
            "Cours de base",
            "Quiz simples",
            "Bibliothèque limitée",
            "Suivi basique",
        ],
        buttonText: "Commencer",
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
        highlighted: false,
    },
    {
        name: "Premium",
        price: "15,000",
        period: "GNF / mois",
        description: "Pour une expérience complète",
        features: [
            "Tous les cours",
            "Quiz avancés illimités",
            "Bibliothèque complète",
            "Suivi détaillé",
            "Orientation scolaire",
            "Support prioritaire",
            "Téléchargements illimités",
        ],
        buttonText: "Choisir Premium",
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
        highlighted: true,
        badge: "Le plus populaire",
    },
    {
        name: "Famille",
        price: "40,000",
        period: "GNF / mois",
        description: "Pour toute la famille",
        features: [
            "Jusqu'à 5 élèves",
            "Tous les avantages Premium",
            "Tableau de bord familial",
            "Alertes personnalisées",
            "Économisez 47%",
        ],
        buttonText: "Choisir Famille",
        buttonColor: "bg-[#1B6B3A] hover:bg-[#155230]",
        highlighted: false,
    },
];

export const Pricing = () => {
    return (
        <section className="bg-[#F8FAFC] py-12 px-4 md:px-12 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-[2rem] font-extrabold text-[#1A3329] mb-3"
                    >
                        Tarifs accessibles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Choisissez le plan qui correspond à vos besoins. Paiement via Orange Money ou MTN Mobile Money.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative bg-white rounded-xl p-6 flex flex-col h-full shadow-2xl shadow-gray-200/50 border-2 ${plan.highlighted ? "border-[#1B6B3A] pb-1.5" : "border-transparent pb-6 md:pb-8"
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1B6B3A] text-xs font-bold px-5 py-1 rounded-full shadow-lg whitespace-nowrap text-white">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-[#1A3329] mb-1.5">
                                    {plan.name}
                                </h3>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl md:text-3xl font-black text-[#1A3329]">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-500 text-sm font-medium mt-1">
                                        {plan.period}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-4 text-sm font-medium">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className={`space-y-3 flex-grow ${plan.highlighted ? "mb-3" : "mb-8"}`}>
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                        <span className="text-gray-700 text-sm font-medium leading-tight">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all transform active:scale-95 shadow-xl ${plan.buttonColor}`}>
                                {plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
};
