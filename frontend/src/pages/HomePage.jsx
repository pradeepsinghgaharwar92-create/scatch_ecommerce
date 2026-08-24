import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiCpu,
  FiClock,
  FiHeart,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/shop/ProductCard";
import CategoryCard from "../components/shop/CategoryCard";
import { SkeletonCard } from "../components/common/Skeleton";

import toast from "react-hot-toast";

/* =========================================================
   IMAGE HELPER
   MongoDB Buffer -> Browser Image URL
========================================================= */

const getProductImage = (product) => {
  if (!product) return "";

  const image = product.Image || product.image || product.imageUrl;

  if (!image) return "";

  /* Already a normal URL */
  if (typeof image === "string") {
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image/")
    ) {
      return image;
    }

    /*
      If backend sends plain base64 string
    */
    return `data:${product.imageContentType || "image/jpeg"};base64,${image}`;
  }

  /*
    MongoDB Buffer serialized by Express:

    {
      type: "Buffer",
      data: [255, 216, 255, ...]
    }
  */

  if (image?.type === "Buffer" && Array.isArray(image.data)) {
    try {
      let binary = "";

      const bytes = new Uint8Array(image.data);

      const chunkSize = 0x8000;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
          ...bytes.subarray(i, i + chunkSize)
        );
      }

      const base64 = btoa(binary);

      return `data:${product.imageContentType || "image/jpeg"
        };base64,${base64}`;
    } catch (error) {
      console.error("Buffer image conversion error:", error);
      return "";
    }
  }

  /*
    Sometimes data may come as:
    { data: [...] }
  */

  if (Array.isArray(image?.data)) {
    try {
      let binary = "";

      const bytes = new Uint8Array(image.data);

      const chunkSize = 0x8000;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
          ...bytes.subarray(i, i + chunkSize)
        );
      }

      const base64 = btoa(binary);

      return `data:${product.imageContentType || "image/jpeg"
        };base64,${base64}`;
    } catch (error) {
      console.error("Image conversion error:", error);
      return "";
    }
  }

  return "";
};

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    name: "Shirts",
    slug: "shirts",
    icon: "👔",
  },
  {
    name: "Jackets",
    slug: "jackets",
    icon: "🧥",
  },
  {
    name: "Bags",
    slug: "bags",
    icon: "👜",
  },
  {
    name: "Pants",
    slug: "pants",
    icon: "👖",
  },
  {
    name: "Footwear",
    slug: "footwear",
    icon: "👟",
  },
];

/* =========================================================
   EDITORIAL IMAGES
========================================================= */

const editorialImages = {
  hero:
    "https://imgs.search.brave.com/ZekaB9grK8DOiXlDieD2nVh4gvsHBHKGpHhLnfg5wQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvOTIy/NTg4MC9wZXhlbHMt/cGhvdG8tOTIyNTg4/MC5qcGVnP2NzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw",

  campaign:
    "https://images.pexels.com/photos/4066292/pexels-photo-4066292.jpeg?auto=compress&cs=tinysrgb&w=1600",

  manifesto:
    "https://uathayam.in/cdn/shop/files/1_443aa1f7-e1d8-43da-9497-55a08a23f860.jpg?v=1773737314&width=1600",
};

/* =========================================================
   HOME PAGE
========================================================= */

const HomePage = () => {
  const navigate = useNavigate();

  const { products = [], loading } = useProducts();

  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(86400);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  /* =========================================================
     PREPARE PRODUCTS WITH IMAGE URL
  ========================================================= */

  const productsWithImages = useMemo(() => {
    return products.map((product) => ({
      ...product,
      imageSrc: getProductImage(product),
    }));
  }, [products]);

  /* =========================================================
     RECENTLY VIEWED
  ========================================================= */

  useEffect(() => {
    try {
      const viewed = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );

      setRecentlyViewed(viewed.slice(0, 4));
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  /* =========================================================
     COUNTDOWN
  ========================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");

    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${hours}:${minutes}:${secs}`;
  };

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  const heroSlides = productsWithImages.slice(0, 3);

  const trendingProducts = productsWithImages.slice(0, 4);

  const aiRecommended = productsWithImages.slice(1, 5);

  const editorialProduct =
    productsWithImages[2] ||
    productsWithImages[0] ||
    null;

  /* =========================================================
     HERO SLIDER
  ========================================================= */

  useEffect(() => {
    if (!heroSlides.length) return;

    const interval = setInterval(() => {
      setActiveSlide(
        (prev) => (prev + 1) % heroSlides.length
      );
    }, 6500);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  /* =========================================================
     COPY PROMO
  ========================================================= */

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("SCATCH30");

      toast.success("Promo Code SCATCH30 copied!");
    } catch {
      toast.error("Unable to copy promo code.");
    }
  };

  /* =========================================================
     ANIMATIONS
  ========================================================= */

  const reveal = {
    hidden: {
      opacity: 0,
      y: 35,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stagger = {
    hidden: {
      opacity: 1,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#e9e4dc]
        dark:bg-[#060606]
        text-zinc-950
        dark:text-white
        transition-colors
        duration-500
      "
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-60
            -left-40
            w-[700px]
            h-[700px]
            rounded-full
            bg-[#b99574]/10
            dark:bg-purple-500/10
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[25%]
            -right-60
            w-[650px]
            h-[650px]
            rounded-full
            bg-[#d2a77c]/10
            dark:bg-indigo-900/20
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            dark:opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,0,0,1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(0,0,0,1) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      <div className="relative z-10">

        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}

        <section
          className="
            relative
            min-h-screen
            lg:min-h-[900px]
            flex
            items-center
            overflow-hidden
            pt-24
            pb-20
          "
        >

          {/* BACKGROUND EDITORIAL IMAGE */}

          <AnimatePresence mode="wait">

            <motion.div
              key={activeSlide}
              initial={{
                opacity: 0,
                scale: 1.12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 1.2,
              }}
              className="
                absolute
                inset-0
                overflow-hidden
              "
            >

              <img
                src={
                  activeSlide === 0
                    ? editorialImages.hero
                    : activeSlide === 1
                      ? editorialImages.campaign
                      : editorialImages.manifesto
                }
                alt="SCATCH campaign"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-20
                  dark:opacity-30
                  grayscale
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#e9e4dc]
                  via-[#e9e4dc]/95
                  to-transparent
                  dark:from-[#060606]
                  dark:via-[#060606]/90
                  dark:to-transparent
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#e9e4dc]
                  via-transparent
                  to-transparent
                  dark:from-[#060606]
                "
              />

            </motion.div>

          </AnimatePresence>

          {/* GIANT TEXT */}

          <div
            className="
              absolute
              top-[13%]
              left-[2%]
              text-[19vw]
              font-black
              tracking-[-0.12em]
              leading-none
              text-black/[0.035]
              dark:text-white/[0.025]
              select-none
            "
          >
            SCATCH
          </div>

          <div
            className="
              relative
              z-20
              max-w-[1550px]
              mx-auto
              w-full
              px-6
              md:px-12
              xl:px-20
            "
          >

            <div
              className="
                grid
                lg:grid-cols-12
                gap-10
                items-center
                min-h-[760px]
              "
            >

              {/* =================================================
                  LEFT
              ================================================== */}

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="
                  lg:col-span-6
                  relative
                  z-30
                "
              >

                <motion.div
                  variants={reveal}
                  className="
                    flex
                    items-center
                    gap-4
                    mb-8
                  "
                >

                  <span
                    className="
                      w-14
                      h-px
                      bg-black
                      dark:bg-white
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.4em]
                      font-black
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    SCATCH / NEW FORM / 2026
                  </span>

                </motion.div>

                <motion.h1
                  variants={reveal}
                  className="
                    text-[64px]
                    sm:text-[82px]
                    md:text-[105px]
                    xl:text-[140px]
                    leading-[0.72]
                    tracking-[-0.09em]
                    font-black
                    uppercase
                  "
                >

                  <span className="block">
                    WEAR
                  </span>

                  <span
                    className="
                      block
                      text-black/10
                      dark:text-white/10
                    "
                  >
                    WHAT
                  </span>

                  <span
                    className="
                      block
                      bg-gradient-to-r
                      from-[#151515]
                      via-[#765846]
                      to-[#b28b69]
                      dark:from-white
                      dark:via-[#ddd4e8]
                      dark:to-[#a67bd1]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    MATTERS.
                  </span>

                </motion.h1>

                <motion.p
                  variants={reveal}
                  className="
                    mt-10
                    max-w-[470px]
                    text-sm
                    md:text-base
                    leading-7
                    text-zinc-500
                    dark:text-zinc-400
                  "
                >
                  A considered collection for people
                  who don't follow the room — they
                  change it. Refined silhouettes,
                  quiet details, unmistakably SCATCH.
                </motion.p>

                <motion.div
                  variants={reveal}
                  className="
                    flex
                    flex-wrap
                    gap-4
                    mt-9
                  "
                >

                  <Link
                    to="/shop"
                    className="
                      group
                      relative
                      overflow-hidden
                      inline-flex
                      items-center
                      gap-4
                      px-7
                      py-4
                      rounded-full
                      bg-[#111]
                      dark:bg-white
                      text-white
                      dark:text-black
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      shadow-[0_25px_60px_rgba(0,0,0,0.2)]
                      hover:scale-[1.04]
                      transition-all
                      duration-300
                    "
                  >

                    <span
                      className="
                        absolute
                        inset-0
                        translate-x-[-100%]
                        group-hover:translate-x-[100%]
                        transition-transform
                        duration-700
                        bg-gradient-to-r
                        from-transparent
                        via-white/30
                        to-transparent
                      "
                    />

                    <span className="relative z-10">
                      Explore Collection
                    </span>

                    <span
                      className="
                        relative
                        z-10
                        w-7
                        h-7
                        rounded-full
                        bg-white/10
                        dark:bg-black/10
                        flex
                        items-center
                        justify-center
                        group-hover:translate-x-1
                        transition-transform
                      "
                    >
                      <FiArrowRight size={13} />
                    </span>

                  </Link>

                  <Link
                    to="/shop?sortby=newest"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-3
                      px-7
                      py-4
                      rounded-full
                      border
                      border-black/10
                      dark:border-white/10
                      bg-white/20
                      dark:bg-white/[0.03]
                      backdrop-blur-xl
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      hover:bg-black
                      hover:text-white
                      dark:hover:bg-white
                      dark:hover:text-black
                      transition-all
                    "
                  >
                    New Arrivals

                    <FiArrowRight
                      size={12}
                      className="
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />

                  </Link>

                </motion.div>

                <motion.div
                  variants={reveal}
                  className="
                    flex
                    items-center
                    gap-7
                    mt-12
                  "
                >

                  <div>
                    <p className="text-lg font-black">
                      24+
                    </p>

                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.3em]
                        text-zinc-400
                        mt-1
                      "
                    >
                      Pieces
                    </p>
                  </div>

                  <div className="w-px h-8 bg-black/10 dark:bg-white/10" />

                  <div>
                    <p className="text-lg font-black">
                      06
                    </p>

                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.3em]
                        text-zinc-400
                        mt-1
                      "
                    >
                      Categories
                    </p>
                  </div>

                  <div className="w-px h-8 bg-black/10 dark:bg-white/10" />

                  <div>
                    <p className="text-lg font-black">
                      01
                    </p>

                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.3em]
                        text-zinc-400
                        mt-1
                      "
                    >
                      New Edit
                    </p>
                  </div>

                </motion.div>

              </motion.div>

              {/* =================================================
                  RIGHT PREMIUM PRODUCT DISPLAY
              ================================================== */}

              <div
                className="
                  lg:col-span-6
                  relative
                  min-h-[650px]
                  flex
                  items-center
                  justify-center
                "
              >

                {/* ORBIT 1 */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    w-[350px]
                    h-[350px]
                    md:w-[520px]
                    md:h-[520px]
                    rounded-full
                    border
                    border-black/10
                    dark:border-white/10
                  "
                />

                {/* ORBIT 2 */}

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 42,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    w-[430px]
                    h-[430px]
                    md:w-[650px]
                    md:h-[650px]
                    rounded-full
                    border
                    border-dashed
                    border-black/10
                    dark:border-white/10
                  "
                />

                {/* CENTER GLOW */}

                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.45, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    w-[330px]
                    h-[330px]
                    md:w-[480px]
                    md:h-[480px]
                    rounded-full
                    bg-[#a98b70]/20
                    dark:bg-purple-600/10
                    blur-[100px]
                  "
                />

                {heroSlides.length > 0 ? (

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={activeSlide}
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        y: 40,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.92,
                        y: -30,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="
                        relative
                        z-20
                        flex
                        flex-col
                        items-center
                      "
                    >

                      {/* PRODUCT IMAGE */}

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
                        onClick={() =>
                          navigate(
                            `/product/${heroSlides[activeSlide]?._id}`
                          )
                        }
                        className="
                          relative
                          w-[270px]
                          h-[390px]
                          sm:w-[310px]
                          sm:h-[430px]
                          md:w-[350px]
                          md:h-[500px]
                          rounded-[45px]
                          overflow-hidden
                          cursor-pointer
                          border
                          border-white/40
                          dark:border-white/10
                          bg-[#ddd5ca]
                          dark:bg-[#151515]
                          shadow-[0_50px_120px_rgba(0,0,0,0.35)]
                          group
                        "
                      >

                        {/* IMAGE */}

                        {heroSlides[activeSlide]?.imageSrc ? (

                          <img
                            src={
                              heroSlides[activeSlide]
                                .imageSrc
                            }
                            alt={
                              heroSlides[activeSlide]
                                ?.name ||
                              "SCATCH Product"
                            }
                            className="
                              absolute
                              inset-0
                              w-full
                              h-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-105
                            "
                          />

                        ) : (

                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              text-zinc-400
                              text-xs
                              uppercase
                              tracking-widest
                            "
                          >
                            Image unavailable
                          </div>

                        )}

                        {/* IMAGE OVERLAY */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/40
                            via-transparent
                            to-black/5
                            pointer-events-none
                          "
                        />

                        {/* TOP LABEL */}

                        <div
                          className="
                            absolute
                            top-5
                            left-5
                            px-4
                            py-2
                            rounded-full
                            bg-white/25
                            backdrop-blur-xl
                            border
                            border-white/30
                            text-white
                            text-[7px]
                            uppercase
                            tracking-[0.3em]
                            font-black
                          "
                        >
                          SCATCH / 0{activeSlide + 1}
                        </div>

                        {/* HEART */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(
                              "Added to wishlist"
                            );
                          }}
                          className="
                            absolute
                            top-5
                            right-5
                            w-10
                            h-10
                            rounded-full
                            bg-black/30
                            backdrop-blur-xl
                            border
                            border-white/20
                            flex
                            items-center
                            justify-center
                            text-white
                            hover:bg-white
                            hover:text-black
                            transition
                          "
                        >
                          <FiHeart size={15} />
                        </button>

                        {/* BOTTOM PRODUCT NAME */}

                        <div
                          className="
                            absolute
                            bottom-5
                            left-5
                            right-5
                            p-5
                            rounded-[25px]
                            bg-black/45
                            backdrop-blur-xl
                            border
                            border-white/10
                            text-white
                          "
                        >

                          <p
                            className="
                              text-[7px]
                              uppercase
                              tracking-[0.3em]
                              text-white/50
                            "
                          >
                            Current Piece
                          </p>

                          <div
                            className="
                              flex
                              items-end
                              justify-between
                              gap-3
                              mt-2
                            "
                          >

                            <h3
                              className="
                                text-base
                                font-black
                                uppercase
                                truncate
                              "
                            >
                              {
                                heroSlides[
                                  activeSlide
                                ]?.name
                              }
                            </h3>

                            <span className="text-sm font-black">
                              ₹
                              {
                                heroSlides[
                                  activeSlide
                                ]?.price
                              }
                            </span>

                          </div>

                        </div>

                      </motion.div>

                      {/* FLOATING PRICE */}

                      <motion.div
                        animate={{
                          y: [-8, 8, -8],
                          rotate: [0, 3, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          absolute
                          right-[-10px]
                          md:right-[-25px]
                          top-[13%]
                          z-30
                          w-[90px]
                          h-[90px]
                          rounded-full
                          bg-[#111]
                          text-white
                          dark:bg-white
                          dark:text-black
                          shadow-2xl
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >

                        <span
                          className="
                            text-[7px]
                            uppercase
                            tracking-[0.2em]
                            opacity-40
                          "
                        >
                          From
                        </span>

                        <span className="text-sm font-black mt-1">
                          ₹
                          {
                            heroSlides[
                              activeSlide
                            ]?.price
                          }
                        </span>

                      </motion.div>

                      {/* FLOATING INFO */}

                      <motion.div
                        animate={{
                          y: [8, -8, 8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          absolute
                          left-[-20px]
                          md:left-[-55px]
                          bottom-[16%]
                          z-30
                          p-5
                          rounded-[22px]
                          bg-white/90
                          dark:bg-zinc-900/95
                          text-black
                          dark:text-white
                          backdrop-blur-2xl
                          border
                          border-black/5
                          dark:border-white/10
                          shadow-2xl
                        "
                      >

                        <div className="flex items-center gap-2">

                          <div
                            className="
                              w-7
                              h-7
                              rounded-full
                              bg-black
                              dark:bg-white
                              text-white
                              dark:text-black
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <FiStar size={12} />
                          </div>

                          <div>

                            <p
                              className="
                                text-[7px]
                                uppercase
                                tracking-[0.25em]
                                text-zinc-400
                              "
                            >
                              SCATCH EDIT
                            </p>

                            <p className="text-[10px] font-black mt-1">
                              Featured piece
                            </p>

                          </div>

                        </div>

                      </motion.div>

                      {/* SLIDER */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          mt-8
                        "
                      >

                        {heroSlides.map((_, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              setActiveSlide(index)
                            }
                            className={`
                              h-1.5
                              rounded-full
                              transition-all
                              duration-500
                              ${activeSlide === index
                                ? "w-12 bg-black dark:bg-white"
                                : "w-2 bg-black/20 dark:bg-white/20"
                              }
                            `}
                          />

                        ))}

                      </div>

                    </motion.div>

                  </AnimatePresence>

                ) : (

                  <div
                    className="
                      relative
                      z-20
                      text-center
                    "
                  >

                    <div
                      className="
                        animate-spin
                        rounded-full
                        h-10
                        w-10
                        border-t-2
                        border-b-2
                        border-black
                        dark:border-white
                        mx-auto
                      "
                    />

                    <p
                      className="
                        mt-5
                        text-[9px]
                        uppercase
                        tracking-widest
                        text-zinc-400
                      "
                    >
                      Loading Collection
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* SCROLL */}

          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              absolute
              bottom-8
              left-1/2
              -translate-x-1/2
              hidden
              md:flex
              flex-col
              items-center
              gap-3
            "
          >

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.35em]
                text-zinc-400
              "
            >
              Scroll
            </span>

            <div
              className="
                w-px
                h-10
                bg-gradient-to-b
                from-black/50
                to-transparent
                dark:from-white/50
              "
            />

          </motion.div>

        </section>

        {/* =====================================================
            MARQUEE
        ====================================================== */}

        <section
          className="
            border-y
            border-black/[0.07]
            dark:border-white/[0.07]
            py-6
            overflow-hidden
            bg-black/[0.02]
            dark:bg-white/[0.02]
          "
        >

          <motion.div
            animate={{
              x: ["0%", "-25%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              flex
              whitespace-nowrap
              gap-12
              w-max
            "
          >

            {Array.from({ length: 8 }).map((_, i) => (

              <React.Fragment key={i}>

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.4em]
                    font-black
                  "
                >
                  LESS NOISE
                </span>

                <span className="text-zinc-400">
                  /
                </span>

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.4em]
                    font-black
                    text-zinc-400
                  "
                >
                  MORE IDENTITY
                </span>

              </React.Fragment>

            ))}

          </motion.div>

        </section>

        {/* =====================================================
            TRUST
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-14
            grid
            grid-cols-1
            md:grid-cols-3
            gap-px
            bg-black/10
            dark:bg-white/10
          "
        >

          {[
            {
              icon: <FiTruck />,
              title: "Free Delivery",
              text: "Complimentary shipping over ₹1000",
            },
            {
              icon: <FiShield />,
              title: "Secure Payments",
              text: "Protected checkout experience",
            },
            {
              icon: <FiRefreshCw />,
              title: "Easy Replacements",
              text: "Simple 7-day exchange protection",
            },
          ].map((item, index) => (

            <motion.div
              key={index}
              whileHover={{
                y: -5,
              }}
              className="
                bg-[#e9e4dc]
                dark:bg-[#070707]
                p-7
                flex
                items-center
                gap-5
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  border
                  border-black/10
                  dark:border-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                {item.icon}
              </div>

              <div>

                <h4
                  className="
                    text-[10px]
                    uppercase
                    tracking-widest
                    font-black
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                    text-[10px]
                    text-zinc-400
                    mt-1
                  "
                >
                  {item.text}
                </p>

              </div>

            </motion.div>

          ))}

        </section>

        {/* =====================================================
            CATEGORIES
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-20
          "
        >

          <div
            className="
              flex
              items-end
              justify-between
              mb-10
            "
          >

            <div>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.3em]
                  font-black
                  text-zinc-400
                "
              >
                Browse the archive
              </span>

              <h2
                className="
                  text-3xl
                  md:text-5xl
                  font-black
                  uppercase
                  tracking-[-0.05em]
                  mt-2
                "
              >
                Categories
              </h2>

            </div>

            <Link
              to="/shop"
              className="
                hidden
                md:flex
                items-center
                gap-2
                text-[9px]
                uppercase
                tracking-widest
                font-black
              "
            >
              View all
              <FiArrowRight />
            </Link>

          </div>

          <div
            className="
              flex
              gap-5
              overflow-x-auto
              pb-5
              scrollbar-none
            "
          >

            {categories.map((category, index) => (

              <motion.div
                key={category.slug}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.07,
                }}
                className="shrink-0"
              >

                <CategoryCard
                  category={category}
                />

              </motion.div>

            ))}

          </div>

        </section>

        {/* =====================================================
            FLASH SALE
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-10
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              relative
              overflow-hidden
              rounded-[35px]
              bg-[#111]
              text-white
              p-8
              md:p-14
            "
          >

            <div
              className="
                absolute
                -right-32
                -top-32
                w-96
                h-96
                rounded-full
                bg-purple-500/20
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
                grid
                md:grid-cols-2
                items-center
                gap-10
              "
            >

              <div>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.35em]
                    text-white/40
                    font-black
                  "
                >
                  Private Archive
                </span>

                <h2
                  className="
                    mt-4
                    text-4xl
                    md:text-6xl
                    font-black
                    uppercase
                    tracking-[-0.06em]
                    leading-[0.9]
                  "
                >
                  Midnight
                  <br />
                  Edit.
                </h2>

                <p
                  className="
                    mt-6
                    text-xs
                    text-white/50
                    max-w-md
                    leading-6
                  "
                >
                  Selected pieces from the current
                  collection, available for a limited
                  time.
                </p>

                <button
                  onClick={copyCodeToClipboard}
                  className="
                    mt-7
                    text-[9px]
                    uppercase
                    tracking-widest
                    font-black
                    border
                    border-white/20
                    px-5
                    py-3
                    rounded-full
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  Copy SCATCH30
                </button>

              </div>

              <div
                className="
                  md:justify-self-end
                  w-full
                  md:w-64
                  p-8
                  rounded-[28px]
                  border
                  border-white/10
                  bg-white/[0.04]
                  backdrop-blur-xl
                  text-center
                "
              >

                <FiClock
                  className="
                    mx-auto
                    text-white/40
                  "
                  size={18}
                />

                <p
                  className="
                    mt-4
                    text-[8px]
                    uppercase
                    tracking-widest
                    text-white/40
                  "
                >
                  Offer ends in
                </p>

                <p
                  className="
                    mt-3
                    text-3xl
                    font-black
                    tracking-widest
                  "
                >
                  {formatTime(timeLeft)}
                </p>

              </div>

            </div>

          </motion.div>

        </section>

        {/* =====================================================
            SMART PICKS
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-20
          "
        >

          <div
            className="
              flex
              items-end
              justify-between
              mb-10
            "
          >

            <div>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.3em]
                  text-zinc-400
                  font-black
                "
              >
                Curated for you
              </span>

              <h2
                className="
                  text-3xl
                  md:text-5xl
                  font-black
                  uppercase
                  tracking-[-0.05em]
                  mt-2
                "
              >
                Smart Picks
              </h2>

            </div>

            <div
              className="
                hidden
                md:flex
                items-center
                gap-2
                text-[9px]
                uppercase
                tracking-widest
                text-zinc-400
              "
            >

              <FiCpu />

              Curated Intelligence

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
            "
          >

            {loading ? (

              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))

            ) : aiRecommended.length > 0 ? (

              aiRecommended.map((product, index) => (

                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                >

                  <ProductCard
                    product={product}
                  />

                </motion.div>

              ))

            ) : (

              <p
                className="
                  col-span-full
                  text-center
                  text-xs
                  text-zinc-400
                "
              >
                No curated items found
              </p>

            )}

          </div>

        </section>

        {/* =====================================================
            MANIFESTO
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-20
          "
        >

          <div
            className="
              relative
              min-h-[560px]
              rounded-[40px]
              overflow-hidden
              bg-[#151515]
              text-white
            "
          >

            <img
              src={editorialImages.manifesto}
              alt="SCATCH campaign"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                opacity-45
                grayscale-[10%]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black
                via-black/55
                to-black/10
              "
            />

            <div
              className="
                relative
                z-10
                min-h-[560px]
                p-8
                md:p-16
                flex
                items-end
              "
            >

              <div className="max-w-2xl">

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.35em]
                    text-white/40
                    font-black
                  "
                >
                  The SCATCH philosophy
                </span>

                <h2
                  className="
                    text-5xl
                    md:text-7xl
                    font-black
                    uppercase
                    tracking-[-0.07em]
                    leading-[0.85]
                    mt-5
                  "
                >
                  Quiet
                  <br />
                  is the
                  <br />
                  statement.
                </h2>

                <p
                  className="
                    mt-7
                    text-sm
                    text-white/50
                    leading-7
                    max-w-md
                  "
                >
                  We create pieces that don't chase
                  trends. Clean silhouettes, refined
                  materials and details designed to
                  become part of your identity.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            EDITORIAL PRODUCT
        ====================================================== */}

        {editorialProduct && (

          <section
            className="
              max-w-7xl
              mx-auto
              px-6
              md:px-12
              py-20
            "
          >

            <div
              className="
                grid
                lg:grid-cols-2
                gap-10
                items-center
              "
            >

              <div
                className="
                  relative
                  min-h-[500px]
                  rounded-[40px]
                  overflow-hidden
                  bg-[#d8cdc0]
                  dark:bg-[#151515]
                  flex
                  items-center
                  justify-center
                "
              >

                <div
                  className="
                    absolute
                    w-72
                    h-72
                    rounded-full
                    bg-white/30
                    blur-[80px]
                  "
                />

                {editorialProduct.imageSrc && (

                  <motion.img
                    whileHover={{
                      scale: 1.06,
                    }}
                    transition={{
                      duration: 0.6,
                    }}
                    src={editorialProduct.imageSrc}
                    alt={editorialProduct.name}
                    onClick={() =>
                      navigate(
                        `/product/${editorialProduct._id}`
                      )
                    }
                    className="
                      relative
                      z-10
                      max-h-[400px]
                      max-w-[80%]
                      object-cover
                      rounded-2xl
                      cursor-pointer
                      drop-shadow-[0_35px_40px_rgba(0,0,0,0.2)]
                    "
                  />

                )}

                <span
                  className="
                    absolute
                    top-7
                    left-7
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    font-black
                    text-black/40
                  "
                >
                  SCATCH / 03
                </span>

              </div>

              <div className="lg:pl-10">

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-zinc-400
                    font-black
                  "
                >
                  Editorial Spotlight
                </span>

                <h2
                  className="
                    mt-5
                    text-4xl
                    md:text-6xl
                    font-black
                    uppercase
                    tracking-[-0.06em]
                    leading-[0.9]
                  "
                >
                  {editorialProduct.name}
                </h2>

                <p
                  className="
                    mt-7
                    text-sm
                    text-zinc-500
                    dark:text-zinc-400
                    leading-7
                    max-w-lg
                  "
                >
                  A considered silhouette built around
                  everyday movement. Refined proportions,
                  tactile materials and a minimal visual
                  language.
                </p>

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    gap-5
                  "
                >

                  <span
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    ₹ {editorialProduct.price}
                  </span>

                  {editorialProduct.discount > 0 && (

                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-widest
                        px-3
                        py-2
                        rounded-full
                        bg-black
                        text-white
                        dark:bg-white
                        dark:text-black
                      "
                    >
                      {editorialProduct.discount}% OFF
                    </span>

                  )}

                </div>

                <Link
                  to={`/product/${editorialProduct._id}`}
                  className="
                    inline-flex
                    items-center
                    gap-3
                    mt-9
                    px-7
                    py-4
                    rounded-full
                    bg-black
                    text-white
                    dark:bg-white
                    dark:text-black
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    font-black
                    hover:scale-[1.03]
                    transition
                  "
                >
                  Discover Piece

                  <FiArrowRight />

                </Link>

              </div>

            </div>

          </section>

        )}

        {/* =====================================================
            TRENDING
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            py-20
          "
        >

          <div className="mb-10">

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-zinc-400
                font-black
              "
            >
              The current edit
            </span>

            <h2
              className="
                text-3xl
                md:text-5xl
                font-black
                uppercase
                tracking-[-0.05em]
                mt-2
              "
            >
              Trending Now
            </h2>

          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
            "
          >

            {loading ? (

              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))

            ) : trendingProducts.length > 0 ? (

              trendingProducts.map((product, index) => (

                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                >

                  <ProductCard
                    product={product}
                  />

                </motion.div>

              ))

            ) : (

              <p
                className="
                  col-span-full
                  text-center
                  text-xs
                  text-zinc-400
                "
              >
                No trending products listed.
              </p>

            )}

          </div>

        </section>

        {/* =====================================================
            RECENTLY VIEWED
        ====================================================== */}

        {recentlyViewed.length > 0 && (

          <section
            className="
              max-w-7xl
              mx-auto
              px-6
              md:px-12
              py-16
              border-t
              border-black/10
              dark:border-white/10
            "
          >

            <div
              className="
                flex
                justify-between
                items-center
                mb-8
              "
            >

              <h2
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-zinc-400
                "
              >
                Recently Viewed
              </h2>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-widest
                  text-zinc-400
                "
              >
                Your archive
              </span>

            </div>

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-6
              "
            >

              {recentlyViewed.map((product) => (

                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    imageSrc: getProductImage(product),
                  }}
                />

              ))}

            </div>

          </section>

        )}

        {/* =====================================================
            FINAL STATEMENT
        ====================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-12
            pt-20
            pb-32
          "
        >

          <div
            className="
              text-center
              border-t
              border-black/10
              dark:border-white/10
              pt-20
            "
          >

            <p
              className="
                text-[8px]
                uppercase
                tracking-[0.4em]
                text-zinc-400
                font-black
              "
            >
              SCATCH ATELIER
            </p>

            <h2
              className="
                mt-5
                text-5xl
                md:text-8xl
                font-black
                uppercase
                tracking-[-0.08em]
                leading-[0.8]
              "
            >
              OWN
              <br />
              YOUR
              <br />
              SPACE.
            </h2>

          </div>

        </section>

      </div>
    </div>
  );
};

export default HomePage;