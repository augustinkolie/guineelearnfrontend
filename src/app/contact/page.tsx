"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiCall } from "@/utils/api";
import { ContactHero } from "@/features/contact/components/ContactHero";
import { ContactInfoPanel } from "@/features/contact/components/ContactInfoPanel";
import { ContactForm } from "@/features/contact/components/ContactForm";

/**
 * ContactPage (Conteneur ultra-léger < 55 lignes)
 * Assemblage des sous-composants, logique d'état uniquement.
 */
export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '',
        userType: 'Élève', subject: 'Inscription et accès aux cours', message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await apiCall('/contact', { method: 'POST', body: JSON.stringify(formData) });
            setIsSent(true);
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <ContactHero />

            <section className="py-20 -mt-10 relative z-20 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <ContactInfoPanel />
                        <div className="lg:col-span-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
                                <ContactForm
                                    formData={formData}
                                    isSubmitting={isSubmitting}
                                    isSent={isSent}
                                    error={error}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    onReset={() => setIsSent(false)}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="w-full overflow-hidden border-t border-gray-200" style={{ height: '500px', marginTop: '60px' }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126075.05609462552!2d-13.6826649!3d9.585897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf1cd6b35d87a41f%3A0xc6c4f0da0b043ec!2sConakry%2C%20Guinea!5e0!3m2!1sen!2sfr!4v1714405550269!5m2!1sen!2sfr"
                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="GuinéeLearn Location Map" />
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
