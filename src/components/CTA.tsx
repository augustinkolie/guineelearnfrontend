"use client";

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const CTA = () => {
    return (
        <section className="relative bg-[#1A4D2E] py-12 px-6 overflow-hidden">

            {/* Animation CSS */}
            <style>{`
              @keyframes swing1 {
                0%   { transform: rotate(-25deg); }
                50%  { transform: rotate(15deg); }
                100% { transform: rotate(-25deg); }
              }
              @keyframes swing2 {
                0%   { transform: rotate(20deg); }
                50%  { transform: rotate(-20deg); }
                100% { transform: rotate(20deg); }
              }
              @keyframes swing3 {
                0%   { transform: rotate(-10deg); }
                50%  { transform: rotate(30deg); }
                100% { transform: rotate(-10deg); }
              }
              @keyframes swing4 {
                0%   { transform: rotate(35deg); }
                50%  { transform: rotate(-5deg); }
                100% { transform: rotate(35deg); }
              }
            `}</style>

            {/* Bâtons lumineux animés */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
              {/* Bâton 1 */}
              <div style={{
                position: 'absolute', top: '-10px', left: '15%',
                transformOrigin: '50% -150px',
                animation: 'swing1 6s ease-in-out infinite',
              }}>
                <div style={{
                  width: '24px', height: '250px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                  borderRadius: '0 0 12px 12px',
                }} />
              </div>

              {/* Bâton 2 */}
              <div style={{
                position: 'absolute', top: '-10px', left: '32%',
                transformOrigin: '50% -150px',
                animation: 'swing2 8s ease-in-out infinite',
              }}>
                <div style={{
                  width: '18px', height: '200px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                  borderRadius: '0 0 8px 8px',
                }} />
              </div>

              {/* Bâton 3 */}
              <div style={{
                position: 'absolute', top: '-10px', left: '55%',
                transformOrigin: '50% -150px',
                animation: 'swing3 7s ease-in-out infinite',
              }}>
                <div style={{
                  width: '30px', height: '300px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                  borderRadius: '0 0 15px 15px',
                }} />
              </div>

              {/* Bâton 4 */}
              <div style={{
                position: 'absolute', top: '-10px', left: '72%',
                transformOrigin: '50% -150px',
                animation: 'swing4 9s ease-in-out infinite',
              }}>
                <div style={{
                  width: '14px', height: '180px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
                  borderRadius: '0 0 6px 6px',
                }} />
              </div>

              {/* Bâton 5 */}
              <div style={{
                position: 'absolute', top: '-10px', left: '88%',
                transformOrigin: '50% -150px',
                animation: 'swing1 5s ease-in-out infinite',
              }}>
                <div style={{
                  width: '22px', height: '220px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                  borderRadius: '0 0 10px 10px',
                }} />
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#27AE60] opacity-[0.08] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#27AE60] opacity-[0.08] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-lg md:text-[1.75rem] lg:text-[2.25rem] font-black text-white mb-4 leading-tight"
                    >
                        Prêt à transformer votre éducation ?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-base text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
                    >
                        Rejoignez des milliers d'élèves, parents et enseignants qui utilisent déjà GuinéeLearn pour réussir.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
                    >
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-[#27AE60] hover:bg-[#219150] text-white font-black text-base rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#27AE60]/20">
                            Commencer gratuitement
                        </button>
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-xl border-2 border-white/20 backdrop-blur-sm transition-all transform active:scale-95">
                            Se connecter
                        </button>
                    </motion.div>


                </div>
            </div>
        </section>
    );
};
