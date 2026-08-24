import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity } = useCart();
  const { product, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-luxury-charcoal rounded-[24px] p-5 mb-4 flex flex-col sm:flex-row items-center gap-5 border border-black/5 dark:border-white/5 shadow-xs"
    >
      {/* Product Image */}
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center p-2 overflow-hidden flex-shrink-0"
        style={{ backgroundColor: product.bgcolor || '#F4EDE4' }}
      >
        {product.Image ? (
          <img
            className="h-16 object-contain"
            src={product.Image.startsWith('data:') ? product.Image : `data:image/jpeg;base64,${product.Image}`}
            alt={product.name}
          />
        ) : (
          <span className="text-[9px] text-zinc-400 font-bold uppercase">No Image</span>
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-zinc-400">Premium Fit</span>
        <h3 className="text-xs font-black uppercase tracking-wider truncate text-zinc-900 dark:text-white">
          {product.name}
        </h3>
        {product.discount > 0 && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[8px] font-extrabold uppercase bg-primary/10 text-primary rounded">
            Special Markdown: {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Price info */}
      <div className="text-center sm:text-right flex-shrink-0">
        <span className="text-sm font-black text-zinc-900 dark:text-white">
          ₹ {product.price}
        </span>
        <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest mt-0.5">
          Per Unit
        </p>
      </div>

      {/* Quantity adjustment */}
      <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-black/25 border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl flex-shrink-0 text-zinc-600 dark:text-zinc-400">
        <button
          onClick={() => decreaseQuantity(product._id)}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          <FiMinus size={12} />
        </button>

        <span className="font-extrabold text-xs w-4 text-center text-zinc-800 dark:text-zinc-200">
          {quantity}
        </span>

        <button
          onClick={() => increaseQuantity(product._id)}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          <FiPlus size={12} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
