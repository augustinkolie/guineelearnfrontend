'use client';

import { LoginHeroPanel } from '@/features/auth/components/LoginHeroPanel';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

/**
 * LoginPage (Conteneur ultra-léger < 25 lignes)
 * Assemblage de sous-composants + délégation de la logique au hook.
 */
export default function LoginPage() {
    const {
        showPassword, setShowPassword,
        emailOrPhone, handleEmailChange,
        password, setPassword,
        isLoading, error,
        captchaToken, setCaptchaToken,
        recaptchaRef,
        handleSubmit, handleGoogleLogin,
        RECAPTCHA_SITE_KEY,
    } = useLoginForm();

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
            <LoginHeroPanel />

            <div className="w-full lg:w-[40%] h-full flex flex-col overflow-y-auto">
                <div className="flex-1 flex items-start justify-center p-6 lg:p-12 lg:pt-12">
                    <LoginForm
                        emailOrPhone={emailOrPhone}
                        password={password}
                        showPassword={showPassword}
                        isLoading={isLoading}
                        error={error}
                        captchaToken={captchaToken}
                        recaptchaRef={recaptchaRef}
                        recaptchaSiteKey={RECAPTCHA_SITE_KEY}
                        onEmailChange={handleEmailChange}
                        onPasswordChange={setPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onCaptchaChange={setCaptchaToken}
                        onSubmit={handleSubmit}
                        onGoogleLogin={() => handleGoogleLogin()}
                    />
                </div>
            </div>
        </div>
    );
}
