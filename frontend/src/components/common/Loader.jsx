import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <motion.div
        className="w-4 h-4 rounded-full bg-primary"
        animate={{
          scale: [0.6, 1.2, 0.6],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-primary"
        animate={{
          scale: [0.6, 1.2, 0.6],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: 0.2,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="w-4 h-4 rounded-full bg-primary"
        animate={{
          scale: [0.6, 1.2, 0.6],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: 0.4,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default Loader;
