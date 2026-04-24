import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`;
  const phoneUrl = `tel:${BUSINESS_INFO.phone}`;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-4">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all group relative"
          >
            <ArrowUp size={30} />
            <span className="absolute right-full mr-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.5)] transition-all group relative"
      >
        <MessageCircle size={30} className="fill-white" />
        <span className="absolute right-full mr-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
          WhatsApp Us
        </span>
      </motion.a>

      {/* Phone Button */}
      <motion.a
        href={phoneUrl}
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.5)] transition-all group relative"
      >
        <Phone size={30} className="fill-white" />
        <span className="absolute right-full mr-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
          Call Directly
        </span>
      </motion.a>
    </div>
  );
}
