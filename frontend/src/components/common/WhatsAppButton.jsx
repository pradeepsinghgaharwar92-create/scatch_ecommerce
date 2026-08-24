import React from 'react';
import { motion } from 'framer-motion';
import { RiWhatsappLine } from 'react-icons/ri';

const WhatsAppButton = () => {
  const number = '+919770454585';
  const text = 'Hiiee I have a Query ';
  const link = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-30 p-4 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl flex items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
    >
      <RiWhatsappLine size={24} />
    </motion.a>
  );
};

export default WhatsAppButton;
