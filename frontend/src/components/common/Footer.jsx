import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiInstagram, FiTwitter, FiFacebook, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to the Scatch private client list!');
    setEmail('');
  };

  return (
    <footer className="bg-luxury-obsidian text-zinc-400 py-20 px-6 md:px-16 border-t border-white/5 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
        
        {/* Brand Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-1.5 text-white">
            <span className="text-xl font-black tracking-[0.2em] bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
              SCATCH
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 font-semibold max-w-sm">
            Rethinking premium apparel through handcrafted modern lines, sustainable Egyptian cotton blends, and sophisticated tones. Tailored for individuals who refuse ordinary.
          </p>
          <div className="flex space-x-4 text-white text-base">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary dark:hover:text-luxury-gold transition-colors"><FiInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary dark:hover:text-luxury-gold transition-colors"><FiTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary dark:hover:text-luxury-gold transition-colors"><FiFacebook /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-extrabold text-[10px] uppercase tracking-widest mb-6">Collections</h4>
          <ul className="space-y-3.5 text-xs font-semibold">
            <li><Link to="/shop?sortby=newest" className="hover:text-white transition-colors">⚜️ Autumn-Winter Edit</Link></li>
            <li><Link to="/shop?category=jackets" className="hover:text-white transition-colors">🧥 Luxury Coats</Link></li>
            <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors">👕 Modern Shirts</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">🛍️ Runway Archives</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white font-extrabold text-[10px] uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-3.5 text-xs font-semibold">
            <li><Link to="/faqs" className="hover:text-white transition-colors">Sizing & FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Client Support</Link></li>
            <li><span className="text-zinc-600 block">UPI, Stripe & Cards Protected</span></li>
            <li><span className="text-zinc-600 block">Complimentary 7-Day Returns</span></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-white font-extrabold text-[10px] uppercase tracking-widest mb-6">Newsletter</h4>
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed font-semibold">
            Subscribe to receive private invitations, early archive sales, and limited co-branded drops.
          </p>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              placeholder="Private Client Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1C] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-primary pr-12 transition-all duration-300 font-semibold"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors"
            >
              <FiMail size={16} />
            </button>
          </form>
        </div>

      </div>

      {/* Copyright & Country */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] font-extrabold tracking-widest uppercase text-zinc-600 space-y-4 md:space-y-0">
        <div>
          © {new Date().getFullYear()} Scatch Inc. Reimagining Minimalism.
        </div>
        <div className="flex items-center space-x-2 font-bold normal-case tracking-normal">
          <FiGlobe />
          <span>India (English) — ₹ INR</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
