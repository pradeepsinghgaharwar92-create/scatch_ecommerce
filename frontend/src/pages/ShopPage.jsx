import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FiX,
  FiSearch,
  FiMic,
  FiSliders,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShoppingBag,
  FiZap,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/shop/ProductCard";
import { SkeletonCard } from "../components/common/Skeleton";
import toast from "react-hot-toast";

const ShopPage = () => {
  const location = useLocation();
  const { products, loading, error } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState(12000);
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Selected product for premium overlay
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const category = params.get("category");
    const search = params.get("search");

    if (category) {
      setSelectedCategory(category);
    }

    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Lock background scroll when product overlay is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  // ESC closes product overlay
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Voice Search
  const triggerVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice search is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    toast.success("Listening... Speak now.");

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setSearchQuery(text);

      toast.success(`Search query: "${text}"`);
    };

    recognition.onerror = () => {
      toast.error("Unable to recognize speech. Please try again.");
    };
  };

  // Open product overlay
  const openProduct = (product) => {
    setSelectedProduct(product);
    setWishlist(false);
  };

  // Close product overlay
  const closeProduct = () => {
    setSelectedProduct(null);
    setWishlist(false);
  };

  // Product image helper
  const getProductImage = (product) => {
    if (!product) {
      return "";
    }

    if (product.image) {
      return product.image;
    }

    if (product.Image) {
      return product.Image;
    }

    if (product.imageUrl) {
      return product.imageUrl;
    }

    if (product.picture) {
      return product.picture;
    }

    return "";
  };

  // Discounted price
  const getDiscountedPrice = (product) => {
    if (!product) {
      return 0;
    }

    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;

    if (discount <= 0) {
      return price;
    }

    return Math.round(price - (price * discount) / 100);
  };

  // Filter + Search + Sort
  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== "all") {
        const productName = String(product.name || "").toLowerCase();

        if (
          selectedCategory === "shirts" &&
          !productName.includes("shirt")
        ) {
          return false;
        }

        if (
          selectedCategory === "jackets" &&
          !productName.includes("jacket") &&
          !productName.includes("coat")
        ) {
          return false;
        }

        if (
          selectedCategory === "bags" &&
          !productName.includes("bag") &&
          !productName.includes("clutch") &&
          !productName.includes("tote")
        ) {
          return false;
        }

        if (
          selectedCategory === "pants" &&
          !productName.includes("pant") &&
          !productName.includes("trouser")
        ) {
          return false;
        }

        if (
          selectedCategory === "footwear" &&
          !productName.includes("shoe") &&
          !productName.includes("footwear")
        ) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const productName = String(product.name || "").toLowerCase();

        if (!productName.includes(query)) {
          return false;
        }
      }

      if (Number(product.price) > priceRange) {
        return false;
      }

      if (
        showOnlyDiscounted &&
        !(Number(product.discount) > 0)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return String(b._id).localeCompare(String(a._id));
      }

      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.96,
    },

    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#080808] text-white">

      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-40
            -left-40
            w-[550px]
            h-[550px]
            rounded-full
            bg-orange-500/10
            blur-[130px]
          "
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[30%]
            -right-48
            w-[600px]
            h-[600px]
            rounded-full
            bg-purple-500/10
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-250px]
            left-[25%]
            w-[650px]
            h-[650px]
            rounded-full
            bg-blue-500/10
            blur-[150px]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

      </div>

      <div className="relative z-10">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 pb-20">

          <div className="grid lg:grid-cols-[1fr_0.9fr] items-center gap-12 lg:gap-20">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20"
            >

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
                className="
                  inline-flex
                  items-center
                  gap-3
                  mb-7
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  backdrop-blur-xl
                "
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-purple-400
                    shadow-[0_0_12px_rgba(192,132,252,0.8)]
                  "
                />

                <span className="text-[9px] uppercase tracking-[0.28em] text-white/50 font-black">
                  SCATCH COLLECTION
                </span>

              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  text-[58px]
                  sm:text-[76px]
                  lg:text-[92px]
                  xl:text-[105px]
                  leading-[0.82]
                  tracking-[-0.07em]
                  font-black
                "
              >

                THE

                <br />

                <span className="text-white/25">
                  NEW
                </span>

                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-white
                    via-white
                    to-purple-300
                    bg-clip-text
                    text-transparent
                  "
                >
                  EDIT.
                </span>

              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.7,
                }}
                className="
                  mt-8
                  max-w-md
                  text-sm
                  sm:text-base
                  leading-7
                  text-white/40
                "
              >
                Curated essentials.
                <br />
                Designed for your everyday identity.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65,
                  duration: 0.6,
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const element =
                    document.getElementById("product-showcase");

                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
                className="
                  group
                  mt-9
                  inline-flex
                  items-center
                  gap-4
                  px-7
                  py-4
                  rounded-full
                  bg-white
                  text-black
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  font-black
                  shadow-[0_15px_50px_rgba(255,255,255,0.12)]
                "
              >

                Explore Collection

                <span
                  className="
                    w-7
                    h-7
                    rounded-full
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  <FiArrowRight size={13} />
                </span>

              </motion.button>

              <div
                className="
                  flex
                  items-center
                  gap-8
                  mt-12
                  pt-7
                  border-t
                  border-white/[0.06]
                  max-w-md
                "
              >

                <div>
                  <p className="text-lg font-black">
                    2026
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/25 font-bold">
                    New Season
                  </p>
                </div>

                <div className="w-px h-8 bg-white/[0.08]" />

                <div>
                  <p className="text-lg font-black">
                    24+
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/25 font-bold">
                    Curated Pieces
                  </p>
                </div>

                <div className="w-px h-8 bg-white/[0.08]" />

                <div>
                  <p className="text-lg font-black">
                    100%
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/25 font-bold">
                    Selected
                  </p>
                </div>

              </div>

            </motion.div>

            {/* HERO IMAGE */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                x: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                min-h-[520px]
                sm:min-h-[620px]
                lg:min-h-[700px]
                flex
                items-center
                justify-center
              "
            >

              <div
                className="
                  absolute
                  w-[350px]
                  h-[350px]
                  sm:w-[500px]
                  sm:h-[500px]
                  rounded-full
                  bg-purple-600/[0.12]
                  blur-[100px]
                "
              />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  w-[330px]
                  h-[330px]
                  sm:w-[470px]
                  sm:h-[470px]
                  rounded-full
                  border
                  border-white/[0.06]
                "
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 45,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  w-[390px]
                  h-[390px]
                  sm:w-[550px]
                  sm:h-[550px]
                  rounded-full
                  border
                  border-purple-300/[0.05]
                "
              />

              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  z-10
                  w-[280px]
                  h-[390px]
                  sm:w-[350px]
                  sm:h-[490px]
                  lg:w-[400px]
                  lg:h-[560px]
                  rounded-[35px]
                  overflow-hidden
                  border
                  border-white/[0.1]
                  bg-[#151517]
                  shadow-[0_40px_100px_rgba(0,0,0,0.55)]
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90"
                  alt="SCATCH Collection"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">

                  <div>

                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/50 font-bold">
                      Featured
                    </p>

                    <p className="mt-1 text-xl font-black">
                      The Essential
                    </p>

                  </div>

                  <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center">
                    <FiArrowRight size={17} />
                  </div>

                </div>

              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  z-20
                  bottom-[10%]
                  left-[0%]
                  sm:left-[2%]
                  lg:left-[-4%]
                  w-[170px]
                  sm:w-[190px]
                  rounded-[22px]
                  border
                  border-white/[0.1]
                  bg-black/60
                  backdrop-blur-2xl
                  p-3
                  shadow-2xl
                "
              >

                <div className="h-28 rounded-[15px] overflow-hidden bg-zinc-900">

                  <img
                    src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=85"
                    alt="Collection"
                    className="w-full h-full object-cover"
                  />

                </div>

                <div className="pt-3 px-1">

                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                    SCATCH / 01
                  </p>

                  <p className="text-xs font-black mt-1">
                    Everyday Edit
                  </p>

                </div>

              </motion.div>

              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  top-[15%]
                  right-[0%]
                  sm:right-[2%]
                  lg:right-[-2%]
                  z-20
                  w-24
                  h-24
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  backdrop-blur-xl
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <span className="text-2xl font-black">
                  01
                </span>

                <span className="text-[7px] uppercase tracking-[0.2em] text-white/30">
                  New Edit
                </span>

              </motion.div>

            </motion.div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY BAR
        ===================================================== */}

        <div
          className="
            sticky
            top-[70px]
            z-30
            border-y
            border-white/[0.06]
            bg-[#080808]/75
            backdrop-blur-2xl
          "
        >

          <div
            className="
              max-w-7xl
              mx-auto
              px-6
              md:px-12
              py-4
              flex
              gap-8
              overflow-x-auto
              scrollbar-hide
            "
          >

            {[
              "all",
              "shirts",
              "jackets",
              "bags",
              "pants",
              "footwear",
            ].map((cat) => {

              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="
                    relative
                    shrink-0
                    pb-2
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    font-black
                    cursor-pointer
                  "
                >

                  <span
                    className={
                      isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-white"
                    }
                  >
                    {cat === "all" ? "ALL PRODUCTS" : cat}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="categoryIndicator"
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[2px]
                        rounded-full
                        bg-white
                      "
                    />
                  )}

                </button>
              );
            })}

          </div>

        </div>

        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-4
              justify-between
              items-center
            "
          >

            <div className="relative w-full md:max-w-md">

              <input
                type="text"
                placeholder="Search the collection..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="
                  w-full
                  py-4
                  pl-12
                  pr-20
                  rounded-full
                  bg-white/[0.05]
                  backdrop-blur-xl
                  border
                  border-white/[0.08]
                  outline-none
                  text-sm
                  placeholder:text-zinc-500
                  focus:border-white/20
                "
              />

              <FiSearch
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-zinc-500
                "
                size={17}
              />

              <div
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  flex
                  gap-3
                  text-zinc-500
                "
              >

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer"
                  >
                    <FiX size={15} />
                  </button>
                )}

                <button
                  onClick={triggerVoiceSearch}
                  className="cursor-pointer"
                >
                  <FiMic size={16} />
                </button>

              </div>

            </div>

            <div className="flex gap-3 w-full md:w-auto">

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="
                  flex-1
                  md:w-48
                  px-5
                  py-4
                  rounded-full
                  bg-[#111]
                  border
                  border-white/[0.08]
                  text-xs
                  font-bold
                  outline-none
                  cursor-pointer
                "
              >

                <option value="popular">
                  Popular
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

              </select>

              <button
                onClick={() =>
                  setFilterDrawerOpen(!filterDrawerOpen)
                }
                className="
                  px-6
                  py-4
                  rounded-full
                  bg-white
                  text-black
                  text-xs
                  font-black
                  flex
                  items-center
                  gap-2
                  cursor-pointer
                  hover:scale-[1.03]
                  transition
                "
              >

                <FiSliders size={14} />

                {filterDrawerOpen ? "Close" : "Filters"}

              </button>

            </div>

          </div>

          <AnimatePresence>

            {filterDrawerOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden"
              >

                <div
                  className="
                    mt-5
                    p-7
                    rounded-[28px]
                    bg-white/[0.04]
                    backdrop-blur-xl
                    border
                    border-white/[0.06]
                    grid
                    md:grid-cols-2
                    gap-8
                  "
                >

                  <div>

                    <div className="flex justify-between mb-4">

                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Maximum Price
                      </span>

                      <span className="text-xs font-black">
                        ₹{priceRange}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="500"
                      max="15000"
                      step="500"
                      value={priceRange}
                      onChange={(event) =>
                        setPriceRange(Number(event.target.value))
                      }
                      className="w-full accent-white"
                    />

                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={showOnlyDiscounted}
                      onChange={() =>
                        setShowOnlyDiscounted(
                          !showOnlyDiscounted
                        )
                      }
                      className="w-4 h-4 accent-white"
                    />

                    <span className="text-xs font-bold">
                      Show discounted pieces only
                    </span>

                  </label>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <main
          id="product-showcase"
          className="
            max-w-[1500px]
            mx-auto
            px-6
            md:px-12
            pb-32
          "
        >

          <div className="flex items-end justify-between mb-8">

            <div>

              <p className="text-[9px] tracking-[0.3em] uppercase font-black text-orange-400 mb-2">
                Featured Selection
              </p>

              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.05em] uppercase">
                Explore
              </h2>

            </div>

            <div
              className="
                hidden
                md:flex
                items-center
                gap-3
                text-[9px]
                uppercase
                tracking-widest
                font-black
                text-zinc-500
              "
            >

              <FiChevronLeft size={14} />

              <span>Swipe to explore</span>

              <FiChevronRight size={14} />

            </div>

          </div>

          {error && (
            <div
              className="
                p-6
                rounded-3xl
                bg-red-500/10
                text-red-500
                text-center
                font-bold
              "
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex gap-6 overflow-hidden">

              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    w-[340px]
                    min-w-[340px]
                    md:w-[420px]
                    md:min-w-[420px]
                  "
                >
                  <SkeletonCard />
                </div>
              ))}

            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="
                flex
                gap-6
                overflow-x-auto
                overflow-y-hidden
                snap-x
                snap-mandatory
                pb-8
                px-1
                scrollbar-hide
                cursor-grab
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >

              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  className="
                    group
                    w-[340px]
                    min-w-[340px]
                    sm:w-[400px]
                    sm:min-w-[400px]
                    lg:w-[440px]
                    lg:min-w-[440px]
                    shrink-0
                    snap-center
                  "
                >

                  <div className="flex items-center justify-between mb-4 px-2">

                    <span className="text-[9px] tracking-[0.25em] font-black text-zinc-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[9px] tracking-[0.2em] uppercase font-black text-zinc-500">
                      SCATCH EDIT
                    </span>

                  </div>

                  <div
                    className="
                      relative
                      transition-all
                      duration-500
                      group-hover:-translate-y-2
                      cursor-pointer
                    "
                    onClick={() => openProduct(product)}
                  >

                    <ProductCard product={product} />

                  </div>

                </motion.div>
              ))}

            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                max-w-lg
                mx-auto
                py-24
                text-center
                rounded-[35px]
                bg-white/[0.04]
                backdrop-blur-xl
                border
                border-white/[0.06]
              "
            >

              <div className="text-5xl mb-5">
                🔍
              </div>

              <h3 className="text-lg font-black uppercase">
                No products found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange(12000);
                  setShowOnlyDiscounted(false);
                }}
                className="
                  mt-7
                  px-7
                  py-3
                  rounded-full
                  bg-white
                  text-black
                  text-[10px]
                  font-black
                  uppercase
                  tracking-widest
                  hover:scale-105
                  transition
                "
              >
                Reset Collection
              </button>

            </motion.div>
          )}

        </main>

        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        {filteredProducts.length > 0 && !loading && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 pb-32">

            <div
              className="
                relative
                overflow-hidden
                rounded-[40px]
                bg-white
                text-black
                px-8
                md:px-16
                py-16
              "
            >

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  w-72
                  h-72
                  rounded-full
                  bg-orange-500/20
                  blur-[80px]
                "
              />

              <div className="relative z-10 max-w-2xl">

                <p className="text-[9px] tracking-[0.35em] uppercase font-black opacity-50 mb-5">
                  SCATCH / BEYOND ORDINARY
                </p>

                <h3
                  className="
                    text-4xl
                    md:text-6xl
                    font-black
                    tracking-[-0.06em]
                    uppercase
                    leading-[0.9]
                  "
                >
                  WEAR
                  <br />
                  YOUR
                  <br />
                  STORY.
                </h3>

                <p className="mt-6 text-sm opacity-60 max-w-md leading-6">
                  Every piece is selected to bring character,
                  confidence and modern design into your everyday wardrobe.
                </p>

              </div>

            </div>

          </section>
        )}

      </div>

      {/* =====================================================
          PREMIUM PRODUCT OVERLAY
          ONLY NEW FEATURE
      ===================================================== */}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="
              fixed
              inset-0
              z-[999]
              bg-black/80
              backdrop-blur-xl
              flex
              items-center
              justify-center
              p-4
              sm:p-8
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProduct}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.88,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.88,
                y: 40,
              }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 18,
              }}
              onClick={(event) => event.stopPropagation()}
              className="
                relative
                w-full
                max-w-6xl
                max-h-[92vh]
                overflow-hidden
                rounded-[32px]
                border
                border-white/[0.12]
                bg-[#111]
                shadow-[0_40px_120px_rgba(0,0,0,0.7)]
              "
            >

              {/* CLOSE */}

              <button
                onClick={closeProduct}
                className="
                  absolute
                  top-5
                  right-5
                  z-30
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  text-black
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                  cursor-pointer
                "
              >
                <FiX size={19} />
              </button>

              <div
                className="
                  grid
                  lg:grid-cols-2
                  max-h-[92vh]
                  overflow-y-auto
                "
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="
                    relative
                    min-h-[430px]
                    lg:min-h-[650px]
                    flex
                    items-center
                    justify-center
                    bg-[#171717]
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      absolute
                      w-[400px]
                      h-[400px]
                      rounded-full
                      bg-purple-500/10
                      blur-[100px]
                    "
                  />

                  <motion.img
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.15,
                      duration: 0.6,
                    }}
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="
                      relative
                      z-10
                      w-full
                      h-full
                      max-h-[650px]
                      object-contain
                      p-8
                      sm:p-12
                    "
                  />

                  {Number(selectedProduct.discount) > 0 && (
                    <div
                      className="
                        absolute
                        left-6
                        top-6
                        z-20
                        px-4
                        py-2
                        rounded-full
                        bg-orange-500
                        text-white
                        text-[9px]
                        font-black
                        uppercase
                        tracking-widest
                        shadow-lg
                      "
                    >
                      {selectedProduct.discount}% OFF
                    </div>
                  )}

                </div>

                {/* PRODUCT INFO */}

                <div
                  className="
                    relative
                    p-7
                    sm:p-10
                    lg:p-14
                    flex
                    flex-col
                    justify-center
                  "
                >

                  <p className="text-[9px] uppercase tracking-[0.35em] text-orange-400 font-black mb-5">
                    SCATCH / PREMIUM EDIT
                  </p>

                  <h2
                    className="
                      text-3xl
                      sm:text-5xl
                      font-black
                      uppercase
                      tracking-[-0.05em]
                      leading-[0.95]
                    "
                  >
                    {selectedProduct.name}
                  </h2>

                  <div className="mt-8 flex items-center gap-4">

                    <span className="text-3xl font-black">
                      ₹{getDiscountedPrice(selectedProduct)}
                    </span>

                    {Number(selectedProduct.discount) > 0 && (
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{selectedProduct.price}
                      </span>
                    )}

                  </div>

                  {Number(selectedProduct.discount) > 0 && (
                    <div
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        w-fit
                        px-4
                        py-2
                        rounded-full
                        bg-green-500/10
                        border
                        border-green-500/20
                        text-green-400
                        text-[9px]
                        uppercase
                        tracking-widest
                        font-black
                      "
                    >
                      <FiZap size={12} />
                      Limited Offer
                    </div>
                  )}

                  <p className="mt-8 text-sm leading-7 text-white/40 max-w-md">
                    A carefully selected SCATCH piece designed
                    for modern everyday style. Premium feel,
                    effortless identity.
                  </p>

                  <div className="mt-10 grid grid-cols-2 gap-3">

                    <button
                      onClick={() => {
                        toast.success("Added to cart");
                      }}
                      className="
                        py-4
                        rounded-2xl
                        bg-white
                        text-black
                        text-[10px]
                        uppercase
                        tracking-widest
                        font-black
                        flex
                        items-center
                        justify-center
                        gap-2
                        hover:scale-[1.02]
                        transition
                        cursor-pointer
                      "
                    >
                      <FiShoppingBag size={15} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        toast.success("Ready for checkout");
                      }}
                      className="
                        py-4
                        rounded-2xl
                        bg-white/[0.06]
                        border
                        border-white/[0.1]
                        text-white
                        text-[10px]
                        uppercase
                        tracking-widest
                        font-black
                        flex
                        items-center
                        justify-center
                        gap-2
                        hover:bg-white/[0.1]
                        transition
                        cursor-pointer
                      "
                    >
                      <FiZap size={15} />
                      Buy Now
                    </button>

                  </div>

                  <button
                    onClick={() => {
                      setWishlist(!wishlist);

                      if (!wishlist) {
                        toast.success("Added to wishlist");
                      } else {
                        toast.success("Removed from wishlist");
                      }
                    }}
                    className="
                      mt-4
                      w-full
                      py-4
                      rounded-2xl
                      border
                      border-white/[0.08]
                      text-[10px]
                      uppercase
                      tracking-widest
                      font-black
                      flex
                      items-center
                      justify-center
                      gap-2
                      hover:bg-white/[0.05]
                      transition
                      cursor-pointer
                    "
                  >

                    <FiHeart
                      size={15}
                      className={
                        wishlist
                          ? "fill-red-500 text-red-500"
                          : ""
                      }
                    />

                    {wishlist
                      ? "Wishlisted"
                      : "Add to Wishlist"}

                  </button>

                  <div className="mt-10 pt-6 border-t border-white/[0.06]">

                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500">

                      <span>
                        SCATCH EDIT
                      </span>

                      <span>
                        Premium Collection
                      </span>

                    </div>

                    <p className="mt-4 text-[9px] text-zinc-600 uppercase tracking-widest">
                      Press ESC to close
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ShopPage;