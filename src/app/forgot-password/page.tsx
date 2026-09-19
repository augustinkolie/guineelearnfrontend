'use client';

import { Mail, ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { apiCall } from '@/utils/api';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password, 4: Success
    const [identifier, setIdentifier] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle code input changes
    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiCall('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ identifier })
            });
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length !== 6) return;
        
        setLoading(true);
        setError('');
        try {
            await apiCall('/auth/verify-reset-code', {
                method: 'POST',
                body: JSON.stringify({ identifier, code: verificationCode })
            });
            setStep(3);
        } catch (err: any) {
            setError(err.message || "Code invalide");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            await apiCall('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ 
                    identifier, 
                    code: code.join(''), 
                    newPassword 
                })
            });
            setStep(4);
        } catch (err: any) {
            setError(err.message || "Échec de la réinitialisation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex bg-[#E8F5EE] overflow-hidden">
            <div className="w-full flex items-center justify-center p-6 lg:p-12 lg:px-24 relative flex-col overflow-y-auto">
                <div className="bg-white rounded-xl p-8 lg:p-10 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    
                    {step === 1 && (
                        <>
                            <div className="mb-6">
                                <Link href="/login" className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-[#1B6B3A] hover:bg-[#1B6B3A] hover:text-white transition-all mb-5 hover:-translate-x-1 shadow-sm group">
                                    <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </Link>
                                <h2 className="text-2xl font-bold text-[#0F2D1E] mb-1.5">Mot de passe oublié ?</h2>
                                <p className="text-gray-500 text-sm">
                                    Entrez votre identifiant pour recevoir un code de validation par email.
                                </p>
                            </div>

                            <form onSubmit={handleRequestCode} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#1E293B] mb-1.5">Email ou Téléphone</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#1B6B3A] transition-colors pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder="exemple@email.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#27AE60] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? 'Envoi...' : 'Envoyer le code'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="mb-8 text-center">
                                <div className="w-16 h-16 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto mb-5">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F2D1E] mb-2">Vérification</h2>
                                <p className="text-gray-500 text-sm">
                                    Saisissez le code à 6 chiffres envoyé à <br/>
                                    <span className="font-bold text-[#0F2D1E]">{identifier}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyCode} className="space-y-8">
                                <div className="flex justify-between gap-2">
                                    {code.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) => { inputRefs.current[idx] = el; }}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                            className="w-12 h-14 text-center text-xl font-black rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#27AE60] outline-none transition-all text-[#1B6B3A]"
                                        />
                                    ))}
                                </div>

                                {error && <p className="text-red-500 text-center text-xs font-medium">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading || code.some(d => !d)}
                                    className="w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? 'Vérification...' : 'Vérifier le code'}
                                </button>

                                <button 
                                    type="button"
                                    onClick={handleRequestCode}
                                    className="w-full text-[#1B6B3A] text-sm font-bold hover:underline"
                                >
                                    Renvoyer le code
                                </button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-[#0F2D1E] mb-1.5">Nouveau mot de passe</h2>
                                <p className="text-gray-500 text-sm">
                                    Créez un mot de passe robuste pour votre compte.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#1E293B] mb-1.5">Nouveau mot de passe</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#1B6B3A] transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#27AE60] outline-none transition-all text-[#1E293B]"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#1B6B3A]"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-[#1E293B] mb-1.5">Confirmer le mot de passe</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#1B6B3A] transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#27AE60] outline-none transition-all text-[#1E293B]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 4 && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F2D1E] mb-3">Succès !</h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block w-full bg-[#1B6B3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98]"
                            >
                                Se connecter
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
