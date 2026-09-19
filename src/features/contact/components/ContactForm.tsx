'use client';

import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
    userType: string;
    subject: string;
    message: string;
}

interface ContactFormProps {
    formData: ContactFormData;
    isSubmitting: boolean;
    isSent: boolean;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
    formData, isSubmitting, isSent, error, onChange, onSubmit, onReset,
}) => {
    if (isSent) {
        return (
            <div className="py-12 text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-[#0F2D1E]">Message envoyé !</h2>
                <p className="text-gray-500 font-medium">Merci de nous avoir contacté. Nous reviendrons vers vous sous 24h.</p>
                <button onClick={onReset} className="mt-8 text-[#1B6B3A] font-bold hover:underline">
                    Envoyer un autre message
                </button>
            </div>
        );
    }

    const inputCls = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#1B6B3A] outline-none transition-all font-medium text-gray-700";
    const labelCls = "text-xs font-black uppercase tracking-widest text-gray-400";

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={labelCls}>Nom complet</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={onChange} placeholder="Augustin Kolie" className={inputCls} />
                </div>
                <div className="space-y-2">
                    <label className={labelCls}>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={onChange} placeholder="votre@email.com" className={inputCls} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={labelCls}>Téléphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="+224 620 00 00 00" className={inputCls} />
                </div>
                <div className="space-y-2">
                    <label className={labelCls}>Vous êtes...</label>
                    <select name="userType" value={formData.userType} onChange={onChange} className={`${inputCls} appearance-none`}>
                        {['Élève', "Parent d'élève", 'Enseignant / Professeur', "Représentant d'école", 'Autre'].map(v => <option key={v}>{v}</option>)}
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className={labelCls}>Sujet de votre demande</label>
                <select name="subject" value={formData.subject} onChange={onChange} className={`${inputCls} appearance-none`}>
                    {['Inscription et accès aux cours', 'Problème technique sur la plateforme', 'Demande de partenariat / Sponsor', "Rejoindre l'équipe pédagogique", 'Autre question'].map(v => <option key={v}>{v}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className={labelCls}>Message</label>
                <textarea name="message" rows={5} required value={formData.message} onChange={onChange} placeholder="Comment pouvons-nous vous aider ?" className={`${inputCls} resize-none`} />
                {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-bold text-base shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#0F2D1E] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {isSubmitting
                    ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    : <><span>Envoyer le message</span><Send className="w-5 h-5" /></>
                }
            </button>
        </form>
    );
};
