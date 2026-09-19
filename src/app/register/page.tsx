'use client';

import Link from 'next/link';
import { RegisterHeroPanel } from '@/features/auth/components/RegisterHeroPanel';
import { RegisterStep1Form } from '@/features/auth/components/RegisterStep1Form';
import { RegisterStep2Form } from '@/features/auth/components/RegisterStep2Form';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';

/**
 * RegisterPage (Conteneur ultra-léger < 55 lignes)
 * Respect des principes SOLID & GoF.
 */
export default function RegisterPage() {
    const {
        currentStep, selectedRole, setSelectedRole, acceptTerms, setAcceptTerms,
        showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
        isLoading, error, captchaToken, setCaptchaToken, recaptchaRef, formData,
        updateFormData, handleContinue, handleBack, handleFinalSubmit,
    } = useRegisterForm();

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
            <RegisterHeroPanel />

            <div className="w-full lg:w-[40%] h-full flex flex-col overflow-y-auto">
                <div className="flex-1 flex items-start justify-center p-6 lg:p-12 lg:pt-12">
                    <div className="w-full max-w-[480px] py-1">
                        <div className="mb-4">
                            <h2 className="text-3xl font-extrabold text-[#1A3329] mb-2">Inscription</h2>
                            <p className="text-[#64748B] font-medium">
                                {currentStep === 1 ? 'Créer votre compte personnel' : 'Détails de votre profil'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 ? (
                            <RegisterStep1Form
                                selectedRole={selectedRole}
                                formData={formData}
                                showPassword={showPassword}
                                showConfirmPassword={showConfirmPassword}
                                onSelectRole={setSelectedRole}
                                onUpdateField={updateFormData}
                                onToggleShowPassword={() => setShowPassword(!showPassword)}
                                onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                onSubmit={handleContinue}
                            />
                        ) : (
                            <RegisterStep2Form
                                selectedRole={selectedRole}
                                formData={formData}
                                acceptTerms={acceptTerms}
                                isLoading={isLoading}
                                captchaToken={captchaToken}
                                recaptchaRef={recaptchaRef}
                                onUpdateField={updateFormData}
                                onAcceptTermsChange={setAcceptTerms}
                                onCaptchaChange={setCaptchaToken}
                                onBack={handleBack}
                                onSubmit={handleFinalSubmit}
                            />
                        )}

                        <div className="text-center pt-8">
                            <p className="text-[#64748B] font-bold">
                                Déjà membre ?{' '}
                                <Link href="/login" className="text-[#64748B] font-medium hover:text-[#1E293B] hover:underline underline-offset-4 transition-colors">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
