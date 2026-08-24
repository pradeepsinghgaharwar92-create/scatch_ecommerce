import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/shop/CartItem';
import { FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CartPage = () => {
  const { cartItems, bill, clearCart, loading } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SCATCH30') {
      setAppliedDiscount(0.3);
      toast.success('SCATCH30 code applied! 30% discount added.');
    } else {
      toast.error('Invalid promo code. Try SCATCH30');
    }
  };

  const discountAmount = bill * appliedDiscount;
  const shippingFee = bill > 1000 || bill === 0 ? 0 : 150;
  const finalTotal = bill - discountAmount + shippingFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Play confetti
    confetti({
      particleCount: 160,
      spread: 85,
      origin: { y: 0.65 }
    });

    // Create order history record to store locally
    const orderId = `SC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      products: cartItems.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        Image: item.product.Image,
        bgcolor: item.product.bgcolor,
        quantity: item.quantity
      })),
      amount: Math.round(finalTotal),
      status: 'Processing'
    };

    const existingOrders = JSON.parse(localStorage.getItem('scatch_orders') || '[]');
    localStorage.setItem('scatch_orders', JSON.stringify([newOrder, ...existingOrders]));

    toast.success('Order placed successfully! Checked out via Private Client channel.', {
      duration: 5000,
    });
    
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-luxury-obsidian text-black dark:text-white pt-28 pb-20 px-6 md:px-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">Shopping Bag</h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} currently saved
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition duration-300 uppercase tracking-wider cursor-pointer"
            >
              <FiTrash2 /> Clear Bag
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-luxury-charcoal rounded-[32px] border border-black/5 dark:border-white/5 p-8 max-w-md mx-auto"
          >
            <span className="text-4xl mb-4">🛍️</span>
            <h3 className="text-md font-extrabold uppercase tracking-wide">Your bag is empty</h3>
            <p className="text-xs text-zinc-500 mt-2 mb-8 max-w-xs text-center leading-relaxed font-semibold">
              Once you add pieces into your catalog, they will appear here for checkout check. Let's find something tailored for you.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition duration-300"
            >
              Start Shopping <FiArrowRight />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Bag items list */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Billing total summary details */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-luxury-charcoal border border-black/5 dark:border-white/5 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 sticky top-28 text-left">
                <h3 className="text-base font-extrabold uppercase tracking-wider pb-3.5 border-b border-black/5 dark:border-white/5">
                  Order Summary
                </h3>

                <div className="space-y-3.5 text-xs font-semibold">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-black dark:text-white">₹ {bill}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Promo code (30%)</span>
                      <span className="font-extrabold">- ₹ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-500">
                    <span>Shipping Fee</span>
                    <span className="font-extrabold text-black dark:text-white">
                      {shippingFee === 0 ? 'FREE' : `₹ ${shippingFee}`}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-zinc-400 font-bold">
                      *Add ₹ {1000 - bill} more for COMPLIMENTARY shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Total Price</span>
                    <p className="text-2xl font-black text-primary dark:text-luxury-gold">₹ {finalTotal.toFixed(2)}</p>
                  </div>
                </div>

                {/* Promo Code input form */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block mb-2">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SCATCH30"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 text-xs font-bold focus:outline-none focus:border-primary transition"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-primary text-white text-[10px] font-bold rounded-xl hover:bg-primary-hover transition uppercase tracking-wider cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold tracking-wider text-xs shadow-lg transition duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingBag /> Checkout Gallery Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
