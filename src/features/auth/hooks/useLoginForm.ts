'use client';

import { useRef, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { apiCall } from '@/utils/api';

const RECAPTCHA_SITE_KEY = '6LczKrcsAAAAADbeEpmMJhSWkMGy8pRnkQuewJPd';

export function useLoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleEmailChange = (value: string) => {
        if (/^[6][0-9]{8}$/.test(value)) {
            setEmailOrPhone(`+224 ${value}`);
        } else {
            setEmailOrPhone(value);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                const data = await apiCall('/auth/google-login', {
                    method: 'POST',
                    body: JSON.stringify({ idToken: tokenResponse.access_token }),
                });
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard';
            } catch (err: any) {
                setError(err.message || 'La connexion Google a échoué');
                setIsLoading(false);
            }
        },
        onError: () => setError('Erreur lors de la connexion avec Google'),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            setError('Veuillez cocher la case "Je ne suis pas un robot".');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ emailOrPhone, password, captchaToken }),
            });
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Échec de la connexion');
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        showPassword, setShowPassword,
        emailOrPhone, handleEmailChange,
        password, setPassword,
        isLoading, error,
        captchaToken, setCaptchaToken,
        recaptchaRef, handleSubmit, handleGoogleLogin,
        RECAPTCHA_SITE_KEY,
    };
}
