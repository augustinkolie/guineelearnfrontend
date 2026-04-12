'use client';

import React, { useState } from 'react';
import { 
    X, 
    Smartphone, 
    CreditCard, 
    CheckCircle, 
    Loader2, 
    ArrowRight,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: any;
    onSuccess: () => void;
}

type PaymentMethod = 'ORANGE' | 'MOBILE_MONEY' | 'CARD' | null;

export const PaymentModal = ({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) => {
    const [method, setMethod] = useState<PaymentMethod>(null);
    const [step, setStep] = useState<'SELECT' | 'FORM' | 'PROCESSING' | 'SUCCESS'>('SELECT');

    const handlePayment = () => {
        setStep('PROCESSING');
        // Simulate payment delay
        setTimeout(() => {
            setStep('SUCCESS');
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#0F2D1E]/60 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 pb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-[#0F2D1E]">Paiement Sécurisé</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Abonnement : {plan?.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="px-8 pb-8 pt-4">
                        {step === 'SELECT' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-gray-500 mb-2">Choisissez votre mode de paiement :</p>
                                    
                                    <button 
                                        onClick={() => { setMethod('ORANGE'); setStep('FORM'); }}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-50 hover:border-orange-500 hover:bg-orange-50/30 transition-all flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                            <Smartphone className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-[#0F2D1E]">Orange Money</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Paiement via USSD ou Application</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                                    </button>

                                    <button 
                                        onClick={() => { setMethod('MOBILE_MONEY'); setStep('FORM'); }}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-50 hover:border-yellow-500 hover:bg-yellow-50/30 transition-all flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-400/20">
                                            <Smartphone className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-[#0F2D1E]">MTN Mobile Money</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">MoMo Guinée</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                                    </button>

                                    <button 
                                        onClick={() => { setMethod('CARD'); setStep('FORM'); }}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-50 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-[#0F2D1E]">Carte Bancaire</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Visa, Mastercard, PayCard</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Paiement 100% sécurisé par cryptage SSL</span>
                                </div>
                            </div>
                        )}

                        {step === 'FORM' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <button onClick={() => setStep('SELECT')} className="text-[#1B6B3A] font-bold text-xs flex items-center gap-1 hover:underline">
                                    ← Changer de mode
                                </button>
                                
                                {method !== 'CARD' ? (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Numéro de téléphone {method === 'ORANGE' ? 'Orange' : 'MTN'}</label>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-gray-400">+224</span>
                                                <input 
                                                    type="tel" 
                                                    placeholder="6XX XX XX XX" 
                                                    className="w-full bg-transparent border-none outline-none text-xl font-black text-[#0F2D1E] placeholder:text-gray-200"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                            Après avoir cliqué sur "Payer", vous recevrez une demande de confirmation sur votre téléphone. Saisissez votre code PIN pour valider.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Titulaire de la carte</label>
                                                <input type="text" placeholder="NOM COMPLETS" className="w-full bg-transparent outline-none font-bold text-[#0F2D1E]" />
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Numéro de Carte</label>
                                                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-transparent outline-none font-bold text-[#0F2D1E]" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Expiration</label>
                                                    <input type="text" placeholder="MM/YY" className="w-full bg-transparent outline-none font-bold text-[#0F2D1E]" />
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">CVC</label>
                                                    <input type="text" placeholder="123" className="w-full bg-transparent outline-none font-bold text-[#0F2D1E]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between text-[#0F2D1E]">
                                        <span className="font-bold">Total à payer</span>
                                        <span className="text-xl font-black">{plan?.price} GNF</span>
                                    </div>
                                    <button 
                                        onClick={handlePayment}
                                        className="w-full py-3 bg-[#1B6B3A] text-white rounded-xl font-black text-sm shadow-xl shadow-[#1B6B3A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Confirmer le Paiement
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'PROCESSING' && (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-[#1B6B3A] animate-spin" />
                                    <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#1B6B3A]/20" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#0F2D1E]">Traitement en cours...</h3>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Sécurisation de la transaction</p>
                                </div>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#0F2D1E]">Félicitations !</h3>
                                    <p className="text-gray-500 font-medium mt-2 leading-relaxed">
                                        Votre abonnement <span className="text-[#1B6B3A] font-black">{plan?.name}</span> est désormais actif.<br />
                                        Apprentissage illimité débloqué !
                                    </p>
                                </div>
                                <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                    Redirection vers votre tableau de bord...
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
