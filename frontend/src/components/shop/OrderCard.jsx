import React from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-luxury-charcoal rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <FiPackage size={18} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wide">
              Order #{order._id.substring(0, 8).toUpperCase()}
            </h4>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
              <FiCalendar /> {order.date}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            {order.status || 'Processing'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Images summary */}
        <div className="flex gap-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-black/20 border border-black/5 p-1 flex items-center justify-center overflow-hidden">
              <img
                src={item.product.Image}
                alt=""
                className="h-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Grand Total</p>
            <span className="text-lg font-extrabold text-primary">
              ₹ {order.total}
            </span>
          </div>
          <Link
            to={`/orders/${order._id}`}
            className="px-4 py-2 border border-zinc-200 dark:border-white/10 hover:border-primary text-xs font-bold rounded-xl transition duration-300"
          >
            Track Order
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
