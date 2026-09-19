'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

interface LoginFormProps {
    emailOrPhone: string;
    password: string;
    showPassword: boolean;
    isLoading: boolean;
    error: string;
    captchaToken: string | null;
    recaptchaRef: React.RefObject<ReCAPTCHA | null>;
    recaptchaSiteKey: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onTogglePassword: () => void;
    onCaptchaChange: (token: string | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleLogin: () => void;
}

const inputCls = "w-full px-6 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] text-base font-medium";

export const LoginForm: React.FC<LoginFormProps> = ({
    emailOrPhone, password, showPassword, isLoading, error,
    captchaToken, recaptchaRef, recaptchaSiteKey,
    onEmailChange, onPasswordChange, onTogglePassword,
    onCaptchaChange, onSubmit, onGoogleLogin,
}) => (
    <div className="w-full max-w-[480px] py-2">
        <div className="mb-4">
            <h2 className="text-3xl font-extrabold text-[#1A3329] mb-2">Bienvenue</h2>
            <p className="text-[#64748B] font-medium">Connectez-vous pour continuer</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                {error}
            </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
            {/* Email / Téléphone */}
            <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#1E293B]">Adresse e-mail</label>
                <input type="text" value={emailOrPhone} onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="blaise@gmail.com" required className={inputCls} />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#1E293B]">Mot de passe</label>
                <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="••••••••••••" required className={inputCls} />
                    <button type="button" onClick={onTogglePassword}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Se souvenir / Mot de passe oublié */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" id="remember" className="h-5 w-5 rounded border-2 border-[#CBD5E1] text-[#1B6B3A] focus:ring-[#1B6B3A]" />
                    <span className="text-sm font-bold text-[#64748B]">Se souvenir de moi</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] hover:underline transition-colors">
                    Mot de passe oublié ?
                </Link>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center py-2">
                <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey}
                    onChange={onCaptchaChange} onExpired={() => onCaptchaChange(null)} />
            </div>

            {/* Bouton connexion */}
            <button type="submit" disabled={isLoading || !captchaToken}
                className="w-full py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading
                    ? <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    : 'Se connecter'
                }
            </button>

            {/* Divider */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">ou continuer avec</span>
                </div>
            </div>

            {/* Google */}
            <button type="button" onClick={onGoogleLogin}
                className="w-full py-3.5 rounded-xl bg-white border-2 border-gray-100 text-[#1E293B] font-bold text-sm transition-all hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
            </button>

            <div className="text-center pt-8">
                <p className="text-[#64748B] font-bold">
                    Vous n&apos;avez pas de compte ?{' '}
                    <Link href="/register" className="text-[#64748B] font-medium hover:text-[#1E293B] hover:underline underline-offset-4 transition-colors">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </form>
    </div>
);
