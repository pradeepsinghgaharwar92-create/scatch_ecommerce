import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const OfferPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem('promoClosed');
    if (!closed) {
      const timer = setTimeout(() => setOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('promoClosed', 'true');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white dark:bg-luxury-obsidian rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col items-center p-8 border border-black/5 dark:border-white/5"
          >
            {/* Close */}
            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            >
              <FiX size={18} />
            </button>

            <span className="text-[4rem] mb-2 animate-bounce">✨</span>
            
            <h2 className="text-3xl font-extrabold text-primary mb-3 text-center tracking-tight">
              SCATCH PRIVÉ
            </h2>
            
            <p className="text-zinc-500 text-sm text-center mb-6 max-w-sm leading-relaxed">
              Unlock our introductory pricing. Enter code <span className="font-bold text-luxury-obsidian dark:text-white px-2 py-1 bg-black/5 dark:bg-white/5 rounded">SCATCH30</span> at checkout for an additional 30% savings.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold tracking-wide transition duration-300"
            >
              Enter The Shop
            </button>

            <p className="text-[10px] text-zinc-400 mt-4 uppercase tracking-widest font-semibold">
              *Limited time launch promotion
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;
