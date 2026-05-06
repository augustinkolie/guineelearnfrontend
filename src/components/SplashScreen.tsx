"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Timeout pour masquer le splash screen après 3.5 secondes
    const timer = setTimeout(() => {
      setShow(false);
    }, 3500); 
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(15, 45, 30, 0.85)', // Semi-transparent pour voir un peu le site
            backdropFilter: 'blur(10px)', // Effet de verre (glassmorphism)
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(27,107,58,0.15)_0%,_transparent_50%)]" />

          {/* Twinkling Particles Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => {
              // Pseudo-random generation for stable SSR without hydration mismatch
              const left = `${(i * 23.5) % 100}%`;
              const top = `${(i * 17.3) % 100}%`;
              const delay = (i % 7) * 0.4;
              const duration = 2 + (i % 4) * 0.5;
              const size = i % 3 === 0 ? 3 : 1.5;
              const isEmerald = i % 4 === 0;

              return (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0, isEmerald ? 0.6 : 0.3, 0], 
                    scale: [0.5, 1.2, 0.5] 
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: duration,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: isEmerald ? '#34d399' : '#ffffff',
                    borderRadius: '50%',
                    boxShadow: isEmerald ? '0 0 10px 2px rgba(52, 211, 153, 0.4)' : '0 0 6px 1px rgba(255, 255, 255, 0.2)'
                  }}
                />
              );
            })}
          </div>

          {/* Center Content */}
          <div className="relative flex items-center justify-center w-[220px] h-[220px]">
            
            {/* Outer semi-circle 1 (spinning clockwise) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.05)',
                borderTopColor: '#34d399', // emerald-400
                borderRightColor: '#34d399',
              }}
            >
              {/* Sparkling Star 1 (Top edge) */}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', top: '1.5px', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', color: '#ffffff', filter: 'drop-shadow(0 0 3px #34d399)' }}>
                <path d="M12 0C12 0 12 10 24 12C24 12 12 14 12 24C12 24 12 14 0 12C0 12 12 10 12 0Z" />
              </svg>
              {/* Sparkling Star 2 (Right edge) */}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', top: '50%', left: 'calc(100% - 1.5px)', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', color: '#ffffff', filter: 'drop-shadow(0 0 3px #34d399)' }}>
                <path d="M12 0C12 0 12 10 24 12C24 12 12 14 12 24C12 24 12 14 0 12C0 12 12 10 12 0Z" />
              </svg>
            </motion.div>
            
            {/* Inner semi-circle 2 (spinning counter-clockwise) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              style={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.05)',
                borderBottomColor: '#10b981', // emerald-500
                borderLeftColor: '#10b981',
              }}
            >
              {/* Sparkling Star 3 (Bottom edge) */}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', top: 'calc(100% - 1.5px)', left: '50%', transform: 'translate(-50%, -50%)', width: '14px', height: '14px', color: '#ffffff', filter: 'drop-shadow(0 0 3px #10b981)' }}>
                <path d="M12 0C12 0 12 10 24 12C24 12 12 14 12 24C12 24 12 14 0 12C0 12 12 10 12 0Z" />
              </svg>
            </motion.div>

            {/* Inner glow pulsating */}
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               style={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(27,107,58,0.4)',
                  filter: 'blur(20px)'
               }}
            />

            {/* Logo Icon Only (Animated with Color Change) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  backgroundColor: ["#ffffff", "#34d399", "#10b981", "#ffffff"],
                  scale: [1, 1.08, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
                }}
                style={{
                  width: '90px',
                  height: '90px',
                  WebkitMaskImage: 'url(/assets/images/logo_no_bg1.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/assets/images/logo_no_bg1.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </motion.div>
          </div>

          {/* Logo Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="mt-6"
          >
            <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Guinée<span className="text-emerald-400">Learn</span>
            </span>
          </motion.div>


        </motion.div>
      )}
    </AnimatePresence>
  );
};
