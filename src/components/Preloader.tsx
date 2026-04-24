import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Force a 3-second load time for branding impact
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Progress bar takes ~2.8s to reach 100%
    const progressInterval = 28; // ms per increment
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, progressInterval);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[10000] bg-dark-bg flex flex-col items-center justify-center p-6"
        >
          {/* Background Pulsing Grid */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-12"
            >
              {/* Spinning Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] rounded-full border border-primary/20 border-t-accent"
              />
              
              <div className="w-24 h-24 bg-gradient-to-br from-[#22c55e] to-[#059669] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] relative">
                <Zap className="text-white fill-white" size={48} />
                
                {/* Pulsing Core */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-3xl bg-[#22c55e]/20 blur-xl"
                />
              </div>
            </motion.div>

            {/* Branding */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-display font-black tracking-tighter text-white sm:text-4xl uppercase">
                POWERSHINE <span className="text-[#22c55e]">TECH</span>
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-[0.5em] font-medium mt-2">
                Initializing Industrial Core
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#059669] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              />
              {/* Scanline Effect */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 h-full"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-mono text-primary-green uppercase tracking-widest flex items-center gap-4"
            >
              <span>System: Online</span>
              <span className="text-slate-700">|</span>
              <span>Load: {Math.round(progress)}%</span>
            </motion.div>
          </div>

          {/* Bottom Technical Display */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-20 hidden md:flex">
            <div className="font-mono text-[8px] space-y-1 text-slate-500">
              <p>SRVC: PR_CORE_V1.2</p>
              <p>AUTH: ISO_9001_CERTIFIED</p>
              <p>LOC: TIRUPPUR_TN_IN</p>
            </div>
            <div className="font-mono text-[8px] space-y-1 text-slate-500 text-right">
              <p>ENC: AES_256_ACTIVE</p>
              <p>RTC: {new Date().toLocaleTimeString()}</p>
              <p>MOD: ELECTRONICS_REPAIR</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
