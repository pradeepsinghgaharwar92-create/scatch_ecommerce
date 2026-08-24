import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to Shop
  React.useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isLogin) {
        const ok = await login(data.email, data.password);
        if (ok) {
          navigate('/home');
        }
      } else {
        const ok = await register(data.fullname, data.email, data.password);
        if (ok) {
          navigate('/home');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    reset();
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#FAF6F0] dark:bg-luxury-obsidian transition-colors duration-500 overflow-x-hidden">

      {/* Left Column: Brand Hero layout (Editorial) */}
      <div className="lg:w-1/2 flex flex-col justify-between p-10 md:p-20 bg-luxury-linen dark:bg-[#0E0E10] border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/5 relative overflow-hidden">
        {/* Glow blur background */}
        <div className="absolute top-[-30%] left-[-20%] w-[80%] aspect-square rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Logo Section */}
        <div className="flex items-center space-x-1.5 text-primary font-bold z-10 text-left">
          <span className="text-2xl font-black tracking-[0.25em] text-zinc-900 dark:text-white uppercase">SCATCH</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </div>

        {/* Hero editorial messaging */}
        <div className="my-20 lg:my-0 space-y-6 max-w-md text-left z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[9px] font-extrabold uppercase tracking-[0.3em] text-primary"
          >
            ⚜️ Private Runway Archive
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight uppercase"
          >
            WEAR YOUR <br />
            <span className="bg-gradient-to-r from-primary to-luxury-bronze bg-clip-text text-transparent">IDENTITY.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold leading-relaxed"
          >
            A curated luxury apparel studio bridging structural modern aesthetics, sustainable fabrics, and timeless styling. Join our private client workspace to view catalog archives.
          </motion.p>
        </div>

        {/* Copyright notice */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-extrabold tracking-widest uppercase z-10 text-left">
          © {new Date().getFullYear()} Scatch Inc. Reimagining Minimalism.
        </div>
      </div>

      {/* Right Column: Credentials card forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-20 relative">
        <div className="absolute bottom-[-30%] right-[-20%] w-[80%] aspect-square rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 md:p-12 rounded-[32px] bg-white dark:bg-luxury-charcoal border border-black/5 dark:border-white/5 shadow-2xl relative"
        >
          <h2 className="text-2xl font-black text-left uppercase tracking-wider mb-2 text-zinc-950 dark:text-white">
            {isLogin ? 'Private Portal' : 'Create Credentials'}
          </h2>
          <p className="text-left text-zinc-500 text-xs mb-8 font-semibold">
            {isLogin ? 'Enter your elite credentials to access custom catalog edits.' : 'Register details below to activate your member access.'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400 pointer-events-none">
                      <FiUser size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      {...registerField('fullname', { required: 'Full name is required' })}
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 text-xs font-semibold focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  {errors.fullname && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fullname.message}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400 pointer-events-none">
                  <FiMail size={14} />
                </span>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  {...registerField('email', {
                    required: 'Email address is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email structure' }
                  })}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 text-xs font-semibold focus:outline-none focus:border-primary transition"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Password Key</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400 pointer-events-none">
                  <FiLock size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerField('password', {
                    required: 'Password key is required',
                    minLength: { value: 6, message: 'Password must have at least 6 characters' }
                  })}
                  className="w-full pl-11 pr-12 py-3.5 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 text-xs font-semibold focus:outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold tracking-wider text-xs shadow-lg transition duration-300 uppercase disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                isLogin ? 'Access Private Edit' : 'Verify & Open Access'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-semibold">
            <span className="text-zinc-400">{isLogin ? "New client to Scatch? " : "Already have access? "}</span>
            <button
              onClick={toggleAuthMode}
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              {isLogin ? 'Request credentials' : 'Access account'}
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default LandingPage;
