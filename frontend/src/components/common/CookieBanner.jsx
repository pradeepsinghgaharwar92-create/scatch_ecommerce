import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-6 z-30 max-w-sm p-6 bg-white dark:bg-luxury-charcoal rounded-2xl shadow-2xl border border-black/5 dark:border-white/5"
        >
          <h3 className="font-bold text-sm mb-2 text-primary">🍪 Cookie Settings</h3>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
            We use cookies to tailor and enhance your luxury shopping experience on Scatch.
          </p>
          <div className="flex justify-end gap-3 text-xs">
            <button 
              onClick={() => setVisible(false)}
              className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-medium"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
