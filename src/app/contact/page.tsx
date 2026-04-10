"use client";

import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulation d'envoi
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-24 relative overflow-hidden text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/images/contact-bg.png" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0F2D1E]/85 backdrop-blur-[2px]" />
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
                        Une question sur nos cours ? Besoin d'assistance ? Notre équipe est là pour vous accompagner dans votre réussite.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 -mt-10 relative z-20 bg-[#F9FAFB]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-center">
                        {/* Form Column */}
                        <div className="w-full max-w-2xl">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100"
                            >
                                {isSent ? (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-3xl font-black text-[#0F2D1E]">Message envoyé !</h2>
                                        <p className="text-gray-500 font-medium">Merci de nous avoir contacté. Nous reviendrons vers vous sous 24h.</p>
                                        <button 
                                            onClick={() => setIsSent(false)}
                                            className="mt-8 text-[#1B6B3A] font-bold hover:underline"
                                        >
                                            Envoyer un autre message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0F2D1E]">Nom complet</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    placeholder="Augustin Kolie"
                                                    className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0F2D1E]">Email</label>
                                                <input 
                                                    type="email" 
                                                    required 
                                                    placeholder="votre@email.com"
                                                    className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0F2D1E]">Téléphone</label>
                                                <input 
                                                    type="tel" 
                                                    required 
                                                    placeholder="+224 620 00 00 00"
                                                    className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0F2D1E]">Vous êtes...</label>
                                                <select className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium appearance-none text-gray-700">
                                                    <option>Élève</option>
                                                    <option>Parent d'élève</option>
                                                    <option>Enseignant / Professeur</option>
                                                    <option>Représentant d'école</option>
                                                    <option>Autre</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0F2D1E]">Sujet de votre demande</label>
                                            <select className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium appearance-none text-gray-700">
                                                <option>Inscription et accès aux cours</option>
                                                <option>Problème technique sur la plateforme</option>
                                                <option>Demande de partenariat / Sponsor</option>
                                                <option>Rejoindre l'équipe pédagogique</option>
                                                <option>Autre question</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0F2D1E]">Message</label>
                                            <textarea 
                                                rows={5} 
                                                required 
                                                placeholder="Comment pouvons-nous vous aider ?"
                                                className="w-full px-6 py-3 rounded-2xl bg-[#F7FCF9] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700 resize-none"
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-[#1B6B3A] text-white rounded-2xl font-black text-base shadow-xl shadow-[#1B6B3A]/20 hover:bg-[#0F2D1E] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Envoyer le message
                                                    <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
