'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveFloatingReactionsProps {
    floatingEmojis: { id: number; emoji: string; x: number }[];
}

export const LiveFloatingReactions: React.FC<LiveFloatingReactionsProps> = ({ floatingEmojis }) => (
    <div className="absolute inset-0 pointer-events-none z-[190] overflow-hidden">
        <AnimatePresence>
            {floatingEmojis.map((e) => (
                <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: window.innerHeight / 2, x: `calc(50% + ${e.x}px)`, scale: 0.5 }}
                    animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: -100, 
                        x: `calc(50% + ${e.x + (Math.random() * 40 - 20)}px)`,
                        scale: e.emoji === '👏' ? [0.5, 1.3, 0.8, 1.3, 1] : [0.5, 1.2, 1],
                        rotate: e.emoji === '👏' ? [0, -10, 10, -10, 0] : Math.random() * 20 - 10
                    }}
                    transition={{ 
                        duration: 2.5, 
                        ease: "easeOut",
                        scale: e.emoji === '👏' ? { repeat: 3, duration: 0.5 } : { duration: 0.5 },
                        rotate: e.emoji === '👏' ? { repeat: 3, duration: 0.5 } : { duration: 0.5 }
                    }}
                    className="absolute text-4xl"
                >
                    {e.emoji}
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);
