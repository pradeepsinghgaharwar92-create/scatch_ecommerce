import React from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiShoppingBag,
  FiArrowUpRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* =========================================================
   CONVERT MONGODB BUFFER / IMAGE TO BROWSER IMAGE URL
========================================================= */

const getImageSrc = (image, contentType = "image/jpeg") => {
  if (!image) return "";

  /* -------------------------------------------------------
     CASE 1: Already a normal URL
  ------------------------------------------------------- */

  if (typeof image === "string") {
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image/")
    ) {
      return image;
    }

    // If backend sends raw base64 string
    return `data:${contentType};base64,${image}`;
  }

  /* -------------------------------------------------------
     CASE 2: MongoDB Buffer JSON format

     {
       type: "Buffer",
       data: [255, 216, 255, ...]
     }
  ------------------------------------------------------- */

  if (
    image.type === "Buffer" &&
    Array.isArray(image.data)
  ) {
    try {
      let binary = "";

      const bytes = image.data;

      // Process in chunks to avoid call stack problems
      const chunkSize = 8192;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(
          i,
          i + chunkSize
        );

        binary += String.fromCharCode(...chunk);
      }

      const base64 = btoa(binary);

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error(
        "Buffer → Base64 conversion failed:",
        error
      );

      return "";
    }
  }

  /* -------------------------------------------------------
     CASE 3: Object containing data array
  ------------------------------------------------------- */

  if (Array.isArray(image.data)) {
    try {
      let binary = "";

      const bytes = image.data;

      const chunkSize = 8192;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(
          i,
          i + chunkSize
        );

        binary += String.fromCharCode(...chunk);
      }

      const base64 = btoa(binary);

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error(
        "Image data conversion failed:",
        error
      );

      return "";
    }
  }

  return "";
};


/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  /* =======================================================
     IMAGE
  ======================================================= */

  const image =
    product?.image ||
    product?.Image ||
    product?.imageUrl;

  const imageSrc = getImageSrc(
    image,
    product?.imageContentType || "image/jpeg"
  );

  /* =======================================================
     DISCOUNT
  ======================================================= */

  const discount =
    Number(product?.discount) || 0;

  /* =======================================================
     PRICE
  ======================================================= */

  const price =
    Number(product?.price) || 0;

  /* =======================================================
     FINAL PRICE
  ======================================================= */

  const finalPrice =
    discount > 0
      ? Math.round(
        price - (price * discount) / 100
      )
      : price;

  /* =======================================================
     PRODUCT CLICK
  ======================================================= */

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  /* =======================================================
     WISHLIST
  ======================================================= */

  const handleWishlist = (e) => {
    e.stopPropagation();

    toast.success("Added to wishlist");
  };

  /* =======================================================
     CART
  ======================================================= */

  const handleCart = (e) => {
    e.stopPropagation();

    toast.success("Added to cart");
  };

  /* =======================================================
     IMAGE ERROR
  ======================================================= */

  const handleImageError = (e) => {
    console.error(
      "Product image failed to load:",
      product
    );

    e.currentTarget.style.display = "none";
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        bg-[#111]
        border
        border-white/[0.07]
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        cursor-pointer
      "
      onClick={handleProductClick}
    >

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          bg-[#171717]
        "
      >

        {/* PRODUCT IMAGE */}

        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={
              product?.name ||
              "SCATCH Product"
            }
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
            "
            whileHover={{
              scale: 1.07,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            onError={handleImageError}
          />
        ) : (
          /* FALLBACK IF IMAGE DOES NOT EXIST */

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              text-white/20
              text-[9px]
              uppercase
              tracking-[0.3em]
              font-black
            "
          >
            No Image
          </div>
        )}


        {/* IMAGE GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-transparent
            pointer-events-none
          "
        />


        {/* ===================================================
            DISCOUNT
        ==================================================== */}

        {discount > 0 && (
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 400,
            }}
            className="
              absolute
              top-4
              left-4
              px-3
              py-1.5
              rounded-full
              bg-white
              text-black
              text-[9px]
              font-black
              tracking-wider
            "
          >
            -{discount}%
          </motion.div>
        )}


        {/* ===================================================
            WISHLIST
        ==================================================== */}

        <motion.button
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.85,
          }}
          onClick={handleWishlist}
          className="
            absolute
            top-4
            right-4
            w-10
            h-10
            rounded-full
            bg-black/40
            backdrop-blur-xl
            border
            border-white/10
            flex
            items-center
            justify-center
            text-white
          "
        >
          <FiHeart size={16} />
        </motion.button>


        {/* ===================================================
            VIEW PRODUCT
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileHover={{
            opacity: 1,
            y: 0,
          }}
          className="
            absolute
            bottom-5
            left-5
            right-5
            hidden
            md:flex
            items-center
            justify-center
          "
        >

          <div
            className="
              px-5
              py-3
              rounded-full
              bg-white
              text-black
              text-[9px]
              font-black
              uppercase
              tracking-widest
              flex
              items-center
              gap-2
            "
          >
            View Product

            <FiArrowUpRight size={13} />
          </div>

        </motion.div>

      </div>


      {/* =====================================================
          DETAILS
      ====================================================== */}

      <div className="p-5">

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div className="min-w-0">

            <p
              className="
                text-[8px]
                uppercase
                tracking-[0.25em]
                text-white/30
                font-bold
                mb-2
              "
            >
              SCATCH EDIT
            </p>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-tight
                truncate
              "
            >
              {product?.name || "Unnamed Product"}
            </h3>

          </div>


          {/* =================================================
              CART
          ================================================== */}

          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: -5,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={handleCart}
            className="
              shrink-0
              w-10
              h-10
              rounded-full
              bg-white
              text-black
              flex
              items-center
              justify-center
            "
          >
            <FiShoppingBag size={15} />
          </motion.button>

        </div>


        {/* =====================================================
            PRICE
        ====================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
          "
        >

          <span className="text-base font-black">
            ₹{finalPrice.toLocaleString("en-IN")}
          </span>

          {discount > 0 && (
            <span
              className="
                text-xs
                text-white/25
                line-through
              "
            >
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}

        </div>

      </div>

    </motion.article>
  );
};

export default ProductCard;