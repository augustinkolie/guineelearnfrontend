'use client';

import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [identifier, setIdentifier] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="h-screen w-full flex bg-[#E8F5EE] overflow-hidden">
            {/* Forgot Password Form */}
            <div className="w-full flex items-center justify-center p-6 lg:p-12 lg:px-24 relative flex-col overflow-y-auto">
                <div className="bg-white rounded-xl p-8 lg:p-10 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {!isSubmitted ? (
                        <>
                            <div className="mb-6">
                                <Link href="/login" className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-[#1B6B3A] hover:bg-[#1B6B3A] hover:text-white transition-all mb-5 hover:-translate-x-1 shadow-sm group">
                                    <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </Link>
                                <h2 className="text-2xl font-bold text-[#0F2D1E] mb-1.5">Mot de passe oublié ?</h2>
                                <p className="text-gray-500 text-sm">
                                    Entrez votre adresse email ou votre numéro de téléphone pour recevoir un lien de réinitialisation.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#1E293B] mb-1.5">Email ou Téléphone</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#1B6B3A] transition-colors pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            value={identifier}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[6][0-9]{8}$/.test(value)) {
                                                    setIdentifier(`+224 ${value}`);
                                                } else {
                                                    setIdentifier(value);
                                                }
                                            }}
                                            placeholder="exemple@email.com ou +224 XXX XXX XXX"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#27AE60] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] cursor-pointer"
                                >
                                    Envoyer le lien
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F2D1E] mb-3">Vérifiez vos messages</h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Si un compte correspond à ces informations, vous recevrez sous peu un lien pour réinitialiser votre mot de passe.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98]"
                            >
                                Retour à la connexion
                            </Link>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="mt-5 text-[#1B6B3A] font-bold hover:underline text-sm"
                            >
                                Renvoyer le lien
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
