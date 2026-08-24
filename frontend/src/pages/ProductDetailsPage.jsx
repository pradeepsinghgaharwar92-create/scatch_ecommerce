import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { SkeletonDetails } from '../components/common/Skeleton';
import ReviewCard from '../components/shop/ReviewCard';
import ProductCard from '../components/shop/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  
  // Selections
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Midnight Ebony');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Hover zoom magnifier coordinates
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  // Fetch product from backend
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/product/${id}`);
      if (res.data) {
        setProduct(res.data);

        // Update recently viewed list in localStorage
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const currentItem = {
          _id: id,
          name: res.data.name,
          price: res.data.price,
          Image: res.data.Image,
          bgcolor: res.data.bgcolor
        };
        const updated = [currentItem, ...recent.filter(item => item._id !== id)].slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));

        // Fetch related products (using the /shop route as base catalog)
        const shopRes = await api.get('/shop');
        if (shopRes.data && Array.isArray(shopRes.data)) {
          setRelated(shopRes.data.filter(p => p._id !== id).slice(0, 4));
        }
      } else {
        toast.error('Unable to load product specifications.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Product details failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const isFavorite = wishlist.some(item => item._id === id);

  // Zoom mouse handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.Image})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '220%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Submit Review to backend
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a feedback message.');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post(`/product/${id}/review`, { rating, comment });
      toast.success('Thank you for sharing your feedback!');
      setComment('');
      setRating(5);
      fetchDetails(); // Reload to fetch details & new review
    } catch (err) {
      console.error(err);
      toast.error('Could not submit feedback review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <SkeletonDetails />;
  }

  if (!product) {
    return (
      <div className="py-40 text-center space-y-4">
        <h2 className="text-xl font-extrabold uppercase tracking-widest text-zinc-400">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          Back to Shop
        </button>
      </div>
    );
  }

  const originalPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 relative">
      
      {/* Detail Block */}
      <div className="bg-white dark:bg-luxury-charcoal rounded-[32px] overflow-hidden border border-black/5 dark:border-white/5 p-6 md:p-12 text-left grid md:grid-cols-2 gap-12 shadow-sm">
        
        {/* Left Column: Image with Magnifier Zoom */}
        <div className="space-y-4">
          <div 
            className="w-full aspect-square rounded-2xl bg-zinc-50 dark:bg-black/20 flex items-center justify-center p-8 overflow-hidden relative cursor-zoom-in border border-black/5 dark:border-white/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundColor: product.bgcolor || '#F4EDE4' }}
          >
            <img
              className="max-h-[340px] object-contain drop-shadow-md"
              src={product.Image}
              alt={product.name}
            />
            {/* Zoom Window Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl border border-black/5" 
              style={zoomStyle}
            />
          </div>
          
          {/* Thumbnail preview */}
          <div className="flex gap-3">
            <button className="w-16 h-16 rounded-xl border-2 border-primary bg-white dark:bg-black/25 p-2 overflow-hidden flex items-center justify-center">
              <img src={product.Image} alt="" className="max-h-full object-contain" />
            </button>
          </div>
        </div>

        {/* Right Column: product info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                In Stock & Ready
              </span>
              <button
                onClick={() => toggleWishlist({ ...product, _id: id })}
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-400 hover:text-red-500 transition shadow-xs cursor-pointer"
              >
                <FiHeart className={`text-sm ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase text-zinc-950 dark:text-white">
              {product.name}
            </h1>

            <p className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">
              ⚜️ Scatch Atelier Release
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center gap-1.5 text-yellow-500 text-xs">
              <div className="flex gap-0.5">
                <FiStar className="fill-yellow-500 text-yellow-500" />
                <FiStar className="fill-yellow-500 text-yellow-500" />
                <FiStar className="fill-yellow-500 text-yellow-500" />
                <FiStar className="fill-yellow-500 text-yellow-500" />
                <FiStar className="fill-yellow-500 text-yellow-500" />
              </div>
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                ({product.reviews.length} Verified Reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="space-y-1 pt-2">
              <h2 className="text-3xl font-black text-primary dark:text-luxury-gold">
                ₹ {product.price}
              </h2>
              {originalPrice && (
                <div className="flex items-center gap-2.5 text-[11px] font-bold">
                  <span className="line-through text-zinc-400">
                    ₹ {originalPrice}
                  </span>
                  <span className="text-green-600 dark:text-green-400 uppercase tracking-widest">
                    {product.discount}% discount code available
                  </span>
                </div>
              )}
            </div>

            {/* Color selectors */}
            <div className="space-y-2 pt-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Colorway Selection</span>
              <div className="flex gap-2">
                {['Midnight Ebony', 'Classic Slate', 'Brushed Ivory'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-[10px] border rounded-xl font-bold uppercase tracking-wide transition-all cursor-pointer ${
                      selectedColor === color 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selectors */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Size Selection</span>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 flex items-center justify-center text-[10px] border rounded-xl font-bold transition-all cursor-pointer ${
                      selectedSize === size 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Quantity</span>
              <div className="flex items-center border border-zinc-200 dark:border-white/10 w-fit rounded-xl overflow-hidden bg-zinc-50 dark:bg-black/20 text-xs">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 hover:bg-zinc-200 dark:hover:bg-white/15 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 py-1.5 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 py-1.5 hover:bg-zinc-200 dark:hover:bg-white/15 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(id);
                }
              }}
              className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <FiShoppingBag /> Add To Cart
            </button>
            <button
              onClick={() => {
                addToCart(id);
                navigate('/cart');
              }}
              className="flex-1 py-4 bg-zinc-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Buy It Now
            </button>
          </div>

        </div>

      </div>

      {/* Tabs panels */}
      <div className="my-12 bg-white dark:bg-luxury-charcoal border border-black/5 dark:border-white/5 rounded-[32px] p-8 text-left shadow-sm">
        <div className="flex border-b border-black/5 dark:border-white/5 pb-4 gap-8 text-xs font-extrabold uppercase tracking-widest">
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-1.5 transition-colors cursor-pointer ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-zinc-400'}`}
          >
            Product Highlights
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`pb-1.5 transition-colors cursor-pointer ${activeTab === 'delivery' ? 'text-primary border-b-2 border-primary' : 'text-zinc-400'}`}
          >
            Delivery & Return Policy
          </button>
        </div>

        <div className="py-6 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
          {activeTab === 'details' ? (
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><FiCheck className="text-green-600" /> Hand-finished tailored styling panels.</li>
              <li className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><FiCheck className="text-green-600" /> Complied from 100% fine organic luxury cotton weaves.</li>
              <li className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><FiCheck className="text-green-600" /> Double stitched hems optimizing robust regular wear.</li>
              <li className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><FiCheck className="text-green-600" /> Natural, fade-resistant color dyes matching aesthetic tones.</li>
            </ul>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <h5 className="font-extrabold text-black dark:text-white uppercase tracking-wider text-[10px]">🚚 Complimentary Shipping</h5>
                <p>Enjoy standard complimentary home delivery in 3 to 5 business days on order edits.</p>
              </div>
              <div className="space-y-1.5">
                <h5 className="font-extrabold text-black dark:text-white uppercase tracking-wider text-[10px]">🔄 Easy Size Swaps</h5>
                <p>We provide a 7-day hassle-free replacement policy on unworn merchandise items.</p>
              </div>
              <div className="space-y-1.5">
                <h5 className="font-extrabold text-black dark:text-white uppercase tracking-wider text-[10px]">🔒 Payment Protection</h5>
                <p>Your transactions are encrypted and secured via Stripe and UPI protocols.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Block */}
      <div className="grid md:grid-cols-3 gap-8 items-start my-12 text-left">
        
        {/* Write a Review */}
        <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-[28px] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="text-lg font-black uppercase tracking-wide">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Rating score</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-xl p-3.5 text-xs font-bold cursor-pointer"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
                <option value="2">⭐⭐ (2 Stars)</option>
                <option value="1">⭐ (1 Star)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400 block">Feedback message</label>
              <textarea
                rows="4"
                placeholder="Share details on texture, fit, or durability..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl p-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition disabled:opacity-50 cursor-pointer"
            >
              {submittingReview ? 'Submitting feedback...' : 'Publish Feedback'}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 bg-white dark:bg-luxury-charcoal p-6 rounded-[28px] border border-black/5 dark:border-white/5 shadow-sm space-y-6">
          <h3 className="text-lg font-black uppercase tracking-wide">Client Feedback</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {product.reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-xs py-16 text-center font-bold uppercase">No reviews recorded. Be the first to share your thoughts!</p>
          )}
        </div>

      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <section className="text-left mt-20">
          <div className="mb-10">
            <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-primary">COMPLETE THE LOOK</span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-1">Recommended Pairings</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailsPage;
