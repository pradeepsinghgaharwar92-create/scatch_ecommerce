import React from 'react';
import { FiStar } from 'react-icons/fi';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm uppercase tracking-wide">
          {review.user?.fullname || 'Anonymous'}
        </h4>
        <span className="text-[10px] text-zinc-400 font-semibold">
          {review.createdAt}
        </span>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 text-yellow-500 my-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar 
            key={i} 
            className={`text-xs ${i < review.rating ? 'fill-yellow-500' : ''}`} 
          />
        ))}
      </div>

      <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed mt-2">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
