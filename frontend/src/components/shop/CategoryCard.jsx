import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/shop?category=${category.slug}`}>
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="w-40 md:w-48 aspect-square rounded-3xl bg-white dark:bg-luxury-charcoal border border-black/5 dark:border-white/5 shadow-md flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <span className="text-4xl md:text-5xl mb-4 transform group-hover:scale-110 transition duration-300 block">
          {category.icon}
        </span>
        <h4 className="font-extrabold text-sm uppercase tracking-wider text-center group-hover:text-primary transition-colors">
          {category.name}
        </h4>
        <span className="text-[10px] text-zinc-400 font-semibold tracking-widest mt-1.5 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Discover →
        </span>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
