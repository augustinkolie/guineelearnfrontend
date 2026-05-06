'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    ShieldCheck, 
    Lock, 
    HelpCircle, 
    CheckCircle2, 
    Clock, 
    RefreshCcw, 
    Smile 
} from 'lucide-react';
import { Footer } from '@/components/Footer';

const PLANS_DATA: Record<string, any> = {
    'Premium': {
        price: '15,000',
        features: [
            'Tous les cours en accès illimité',
            'Support prioritaire 24/7',
            'Certifications reconnues',
            'Accès hors-ligne via application'
        ]
    },
    'Famille': {
        price: '40,000',
        features: [
            'Jusqu\'à 5 élèves inclus',
            'Support familial dédié',
            'Tableau de bord partagé',
            'Accès hors-ligne illimité'
        ]
    },
    'Standard': {
        price: '5,000',
        features: [
            'Cours de base et quiz',
            'Suivi de progression',
            'Support par email standard'
        ]
    }
};

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planName = searchParams.get('plan') || 'Premium';
    const planData = PLANS_DATA[planName] || PLANS_DATA['Premium'];

    const [paymentMethod, setPaymentMethod] = useState('orange');

    const paymentOptions = [
        { id: 'orange', name: 'Orange Money', desc: 'Simple et rapide', logo: '/assets/logo orange money.png' },
        { id: 'momo', name: 'Mobile Money', desc: 'Partout en Guinée', logo: '/assets/logo mobile money.png' },
        { id: 'paycard', name: 'PayCard', desc: 'Visa / Mastercard', logo: '/assets/logo paycard.png' },
        { id: 'paypal', name: 'PayPal', desc: 'International', logo: '/assets/logo paypal.png' },
    ];

    return (
        <div style={{ backgroundColor: '#F8FAFB', minHeight: '100vh', fontFamily: 'inherit', overflowX: 'hidden' }}>
            <style>{`
                .checkout-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%; box-sizing: border-box; }
                .checkout-header { background: white; border-bottom: 1px solid #F1F5F9; height: 80px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
                .card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: none; overflow: hidden; height: fit-content; }
                .plan-header { background-color: #006847; padding: 40px; color: white; }
                .plan-body { padding: 40px; }
                .payment-option { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 8px; border: 2px solid #F8FAFB; background: #F8FAFB; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; box-sizing: border-box; }
                .payment-option.active { border-color: #10B981; background: #ECFDF5; }
                .btn-pay { width: 100%; background-color: #006847; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 20px rgba(0,104,71,0.15); font-size: 15px; }
                .btn-pay:hover { opacity: 0.9; }
                .feature-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; font-weight: 700; color: #4B5563; font-size: 14px; }
                .price-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; font-weight: 900; color: #9CA3AF; letter-spacing: 1px; }
                .total-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 20px; }
                .banner-light { 
                    background: #FFFFFF;
                    border-radius: 16px; 
                    padding: 40px; 
                    color: #111827; 
                    position: relative; 
                    overflow: hidden; 
                    display: flex; 
                    align-items: center; 
                    border: 1px solid #E2E8F0;
                    box-shadow: none;
                    min-height: 180px;
                }
                .banner-text-content {
                    max-width: 60%;
                    position: relative;
                    z-index: 10;
                }
                .image-sans-fond {
                    position: absolute;
                    right: -20px;
                    bottom: -60px;
                    height: 140%;
                    width: auto;
                    object-fit: contain;
                    z-index: 5;
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
                    -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 95%);
                    mask-image: linear-gradient(to bottom, black 60%, transparent 95%);
                }
                .main-grid { display: flex; flex-direction: column; gap: 24px; width: 100%; }
                .payment-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }

                @media (max-width: 768px) {
                    .checkout-container { padding: 0 16px; overflow-x: hidden; }
                    .plan-header, .plan-body, .card { padding: 24px !important; }
                    .banner-light { 
                        flex-direction: column; 
                        padding: 32px 20px; 
                        text-align: center;
                        background-position: bottom center;
                        background-size: 80%;
                        min-height: 350px;
                    }
                    .banner-text-content { max-width: 100%; }
                    .image-sans-fond {
                        height: 300px;
                        position: relative;
                        right: 0; bottom: -20px;
                        margin-top: 20px;
                    }
                    h1 { font-size: 24px !important; line-height: 1.3 !important; }
                    .header-secure-text { display: none; }
                }

                @media (min-width: 1024px) {
                    .main-grid { display: grid; grid-template-columns: 460px 1fr; gap: 20px; }
                    .payment-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
                }
                .radio-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D1D5DB; display: flex; align-items: center; justify-content: center; background: white; }
                .radio-circle.active { border-color: #10B981; background: #10B981; }
                .radio-inner { width: 6px; height: 6px; border-radius: 50%; background: white; }
            `}</style>

            <header className="checkout-header">
                <div className="checkout-container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div 
                        onClick={() => router.push('/')}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    >
                        <img src="/assets/images/logo-icon.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#006847', fontStyle: 'italic', letterSpacing: '-1px' }}>GuinéeLearn</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: '#F8FAFB', border: '1px solid #F1F5F9', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#6B7280', letterSpacing: '1px' }}>
                            <Lock size={14} /> <span className="header-secure-text">PAIEMENT SÉCURISÉ</span>
                        </div>
                        <HelpCircle color="#D1D5DB" />
                    </div>
                </div>
            </header>

            <div className="checkout-container" style={{ paddingBottom: '100px' }}>
                <div style={{ marginTop: '40px', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Finalisez votre inscription</h1>
                    <p style={{ color: '#6B7280', fontWeight: 500, fontSize: '14px', margin: 0 }}>Rejoignez des milliers d'apprenants et accédez à des contenus éducatifs de haute qualité dès aujourd'hui.</p>
                </div>

                <div className="main-grid">
                    <div>
                        <div className="card">
                            <div className="plan-header" style={{ padding: '32px 40px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 12px 0' }}>{planName}</h2>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 900 }}>{planData.price} GNF</span>
                                    <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.7 }}>/ mois</span>
                                </div>
                            </div>
                            <div className="plan-body">
                                <div style={{ marginBottom: '32px' }}>
                                    {planData.features.map((f: string, i: number) => (
                                        <div key={i} className="feature-item">
                                            <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                                    <div className="price-row" style={{ textTransform: 'none', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>
                                        <span>Sous-total</span>
                                        <span style={{ color: '#111827' }}>{planData.price} GNF</span>
                                    </div>
                                    <div className="price-row" style={{ textTransform: 'none', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>
                                        <span>Frais de service</span>
                                        <span style={{ color: '#111827' }}>0 GNF</span>
                                    </div>
                                    <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', border: 'none', paddingTop: '8px', marginTop: '0' }}>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>Total à payer</span>
                                        <span style={{ fontSize: '22px', fontWeight: 900, color: '#006847', whiteSpace: 'nowrap' }}>{planData.price} GNF</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px', padding: '0 8px', marginTop: '32px' }}>
                            {[
                                { icon: ShieldCheck, text: 'PAIEMENT 100% SÉCURISÉ' },
                                { icon: RefreshCcw, text: 'CHIFFREMENT SSL' },
                                { icon: Smile, text: 'SATISFAIT OU REMBOURSÉ' }
                            ].map((b, i) => (
                                <div key={i} style={{ flex: 1, minWidth: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <b.icon size={22} color="#10B981" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '7.5px', fontWeight: 900, color: '#9CA3AF', margin: 0, lineHeight: 1.4, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{b.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="card" style={{ padding: '40px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: '0 0 8px 0' }}>Mode de paiement</h2>
                            <p style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 500, margin: '0 0 40px 0' }}>Sélectionnez votre option de paiement préférée ci-dessous.</p>

                            <div className="payment-grid">
                                {paymentOptions.map((o) => (
                                    <div 
                                        key={o.id} 
                                        className={`payment-option ${paymentMethod === o.id ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod(o.id)}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                            <img src={o.logo} alt={o.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 900, color: '#111827', margin: '0 0 2px 0' }}>{o.name}</p>
                                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{o.desc}</p>
                                        </div>
                                        <div className={`radio-circle ${paymentMethod === o.id ? 'active' : ''}`}>
                                            {paymentMethod === o.id && <div className="radio-inner" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <button className="btn-pay">
                                    <Lock size={18} /> CONFIRMER LE PAIEMENT
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', color: '#9CA3AF' }}>
                                    <Clock size={14} />
                                    <p style={{ fontSize: '10px', fontWeight: 700, margin: 0 }}>En cliquant sur confirmer, vous acceptez nos conditions générales de vente.</p>
                                </div>
                            </div>
                        </div>

                        <div className="banner-light" style={{ marginTop: '24px' }}>
                            <div className="banner-text-content">
                                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 8px 0', color: '#111827' }}>Accès Instantané</h3>
                                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>Dès que votre paiement est validé, vous recevrez un email de confirmation et l'accès à votre tableau de bord sera activé immédiatement.</p>
                            </div>
                            <img 
                                src="/images/image_sans_fond.png" 
                                alt="Illustration" 
                                className="image-sans-fond"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function PremiumCheckout() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFB', color: '#006847', fontWeight: 900 }}>Chargement...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
