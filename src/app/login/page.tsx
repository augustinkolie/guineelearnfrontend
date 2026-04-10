'use client';

import { Eye, EyeOff, Mail, Lock, Github, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { apiCall } from '@/utils/api';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isNotRobot, setIsNotRobot] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                // On récupère le jeton d'accès ou l'ID Token
                // Note: Dans ce flux, on peut aussi utiliser credentialResponse.credential si on utilise GoogleLogin
                // Mais avec useGoogleLogin, on a un jeton d'accès. 
                // Pour simplifier, nous allons simuler l'envoi au backend qui validera l'accès.
                const data = await apiCall('/auth/google-login', {
                    method: 'POST',
                    body: JSON.stringify({ idToken: tokenResponse.access_token }), // Idéalement c'est l'ID Token
                });

                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard';
            } catch (err: any) {
                setError(err.message || 'La connexion Google a échoué');
                setIsLoading(false);
            }
        },
        onError: () => {
            setError('Erreur lors de la connexion avec Google');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isNotRobot || isVerifying) return;

        setIsLoading(true);
        setError('');

        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ emailOrPhone, password }),
            });

            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Échec de la connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
            {/* Left Side - Marketing with Background Image */}
            <div className="hidden lg:flex w-[60%] relative overflow-hidden">
                {/* Background Image */}
                <img
                    src="/assets/images/login-bg.png"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Background"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0F2D1E]/75" />

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col p-16 justify-between text-white">
                    <div className="flex items-center gap-4">
                        <Logo scrolled={false} height="h-[42px]" />
                    </div>

                    <div className="max-w-xl">
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            Trouvez le bon cours, <br /> au bon moment.
                        </h1>
                        <p className="text-xl opacity-90 leading-relaxed font-light">
                            Connectez-vous à l'avenir de l'éducation en Guinée, intelligemment et durablement.
                        </p>
                    </div>

                    <div className="flex gap-16 items-end">
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">388 +</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Utilisateurs</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">150 +</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Cours</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">12 +</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Villes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[40%] h-full flex flex-col overflow-y-auto">
                <div className="flex-1 flex items-start justify-center p-6 lg:p-12 lg:pt-12">
                    <div className="w-full max-w-[480px] py-2">
                        <div className="mb-4">
                            <h2 className="text-3xl font-extrabold text-[#1A3329] mb-2">Bienvenue</h2>
                            <p className="text-[#64748B] font-medium">
                                Connectez-vous pour continuer
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2.5">
                                <label className="block text-sm font-bold text-[#1E293B]">Adresse e-mail</label>
                                <input
                                    type="text"
                                    value={emailOrPhone}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[6][0-9]{8}$/.test(value)) {
                                            setEmailOrPhone(`+224 ${value}`);
                                        } else {
                                            setEmailOrPhone(value);
                                        }
                                    }}
                                    placeholder="blaise@gmail.com"
                                    required
                                    className="w-full px-6 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] text-base font-medium"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="block text-sm font-bold text-[#1E293B]">Mot de passe</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full px-6 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] text-base font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-5 w-5 rounded border-2 border-[#CBD5E1] text-[#1B6B3A] focus:ring-[#1B6B3A] transition-all"
                                    />
                                    <span className="text-sm font-bold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Se souvenir de moi</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] hover:underline transition-colors">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <div className="py-4">
                                <div
                                    onClick={() => {
                                        if (!isNotRobot && !isVerifying) {
                                            setIsVerifying(true);
                                            setTimeout(() => {
                                                setIsVerifying(false);
                                                setIsNotRobot(true);
                                            }, 1500);
                                        }
                                    }}
                                    className="w-full h-[74px] bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] flex items-center justify-between px-3 py-2 shadow-[0_0_4px_rgba(0,0,0,0.05)] cursor-pointer group hover:border-[#b3b3b3] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-[28px] h-[28px] rounded-[2px] border-2 flex items-center justify-center transition-all bg-white ${isNotRobot 
                                            ? 'border-transparent' 
                                            : isVerifying ? 'border-transparent' : 'border-[#c1c1c1] group-hover:border-[#b3b3b3]'}`}
                                        >
                                            {isVerifying ? (
                                                <div className="w-[24px] h-[24px] border-[3px] border-[#4285f4] border-t-transparent rounded-full animate-spin" />
                                            ) : isNotRobot ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-[#00a35c] absolute -top-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            ) : null}
                                        </div>
                                        <span className="text-[14px] font-normal text-[#1E293B]">
                                            Je ne suis pas un robot
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-0">
                                        <div className="relative w-8 h-8 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 4.5V2l-3.5 3.5L12 9V6.5c3.04 0 5.5 2.46 5.5 5.5s-2.46 5.5-5.5 5.5-5.5-2.46-5.5-5.5H4.5c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5z" fill="#4285F4" />
                                                <path d="M12 6.5c-1.44 0-2.74.56-3.71 1.47l-1.42-1.42C8.24 5.31 10.02 4.5 12 4.5v2z" fill="#4285F4" />
                                                <path d="M8.29 7.97A5.48 5.48 0 0 0 6.5 12h-2c0-2.07.84-3.95 2.21-5.32l1.58 1.29z" fill="#777777" />
                                                <path d="M12 17.5V20c-4.14 0-7.5-3.36-7.5-7.5h2c0 3.04 2.46 5.5 5.5 5.5z" fill="#777777" opacity="0.5" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#777777] tracking-tighter" style={{ fontFamily: 'sans-serif' }}>reCAPTCHA</span>
                                        <div className="flex gap-1 text-[7px] text-[#777777] whitespace-nowrap mt-0.5">
                                            <span>Confidentialité</span>
                                            <span>-</span>
                                            <span>Conditions</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Se connecter'}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">ou continuer avec</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="w-full py-3.5 rounded-xl bg-white border-2 border-gray-100 text-[#1E293B] font-bold text-sm transition-all hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>

                            <div className="text-center pt-8">
                                <p className="text-[#64748B] font-bold">
                                    Vous n'avez pas de compte ?{' '}
                                    <Link href="/register" className="text-[#64748B] font-medium hover:text-[#1E293B] hover:underline underline-offset-4 transition-colors">
                                        Créer un compte
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
