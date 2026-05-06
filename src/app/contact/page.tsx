"use client";

import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiCall } from "@/utils/api";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        userType: 'Élève',
        subject: 'Inscription et accès aux cours',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await apiCall('/contact', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setIsSent(true);
        } catch (err: any) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
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
                        Une question sur nos cours ? Besoin d'assistance ? Notre équipe est là pour vous accompagner dans votre réussite.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 -mt-10 relative z-20 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* Info Column (Style Image 2) */}
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
                                    <div className="space-y-1">
                                        <p className="text-gray-200 text-sm flex items-center gap-2">
                                            <span className="text-white font-bold">Téléphone :</span> +224 620 00 00 00
                                        </p>
                                        <p className="text-gray-200 text-sm flex items-center gap-2">
                                            <span className="text-white font-bold">Email :</span> contact@guineelearn.com
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Heures d&apos;ouverture</h3>
                                    <div className="space-y-1 text-sm text-gray-200">
                                        <p>Lundi - Vendredi : 08:00 - 18:00</p>
                                        <p>Samedi - Dimanche : 09:00 - 15:00</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold">Suivez-nous</h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { icon: Facebook, name: 'facebook' },
                                        { icon: Twitter, name: 'twitter' },
                                        { icon: Instagram, name: 'instagram' },
                                        { icon: Youtube, name: 'youtube' }
                                    ].map((social, idx) => (
                                        <button 
                                            key={idx}
                                            style={{ backgroundColor: '#F59E0B' }}
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-[#0F2D1E] hover:scale-110 transition-all shadow-lg active:scale-95"
                                        >
                                            <social.icon className="w-6 h-6" strokeWidth={2.5} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <div className="lg:col-span-8">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm"
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
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom complet</label>
                                                <input 
                                                    type="text"
                                                    name="fullName"
                                                    required 
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Augustin Kolie"
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                                                <input 
                                                    type="email"
                                                    name="email"
                                                    required 
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="votre@email.com"
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Téléphone</label>
                                                <input 
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+224 620 00 00 00"
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Vous êtes...</label>
                                                <select name="userType" value={formData.userType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium appearance-none text-gray-700">
                                                    <option>Élève</option>
                                                    <option>Parent d'élève</option>
                                                    <option>Enseignant / Professeur</option>
                                                    <option>Représentant d'école</option>
                                                    <option>Autre</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Sujet de votre demande</label>
                                            <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium appearance-none text-gray-700">
                                                <option>Inscription et accès aux cours</option>
                                                <option>Problème technique sur la plateforme</option>
                                                <option>Demande de partenariat / Sponsor</option>
                                                <option>Rejoindre l'équipe pédagogique</option>
                                                <option>Autre question</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message</label>
                                            <textarea 
                                                name="message"
                                                rows={5} 
                                                required 
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Comment pouvons-nous vous aider ?"
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700 resize-none"
                                            ></textarea>
                                            {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-bold text-base shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#0F2D1E] hover:-translate-y-0.5 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
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

                {/* Google Map Section - Pleine largeur (Edge to Edge) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full overflow-hidden border-t border-gray-200"
                    style={{ height: '500px', marginTop: '60px' }}
                >
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126075.05609462552!2d-13.6826649!3d9.585897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf1cd6b35d87a41f%3A0xc6c4f0da0b043ec!2sConakry%2C%20Guinea!5e0!3m2!1sen!2sfr!4v1714405550269!5m2!1sen!2sfr" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="GuinéeLearn Location Map"
                    ></iframe>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
