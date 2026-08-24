import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';
import { FiHeart, FiArrowRight } from 'react-icons/fi';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-luxury-obsidian text-black dark:text-white pt-28 pb-20 px-6 md:px-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10">
          <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-primary">Private Selection</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase mt-1">Your Wishlist</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your runway shortlist
          </p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-luxury-charcoal rounded-[32px] border border-black/5 dark:border-white/5 p-8 max-w-md mx-auto"
          >
            <span className="text-4xl mb-4">❤️</span>
            <h3 className="text-md font-extrabold uppercase tracking-wide">Your wishlist is empty</h3>
            <p className="text-xs text-zinc-500 mt-2 mb-8 max-w-xs text-center leading-relaxed font-semibold">
              Save your favorite luxury pieces here. Explore our shop collection and build your personalized apparel shortlist.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition duration-300"
            >
              Start Exploring <FiArrowRight />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
          >
            <AnimatePresence>
              {wishlist.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
