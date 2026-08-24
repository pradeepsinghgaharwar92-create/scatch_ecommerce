import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiBriefcase,
  FiDollarSign,
  FiPercent,
  FiX,
  FiCheck,
  FiEye,
  FiShoppingBag,
  FiImage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";

const AdminPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const [bgcolor, setBgcolor] = useState("#E8E0D5");
  const [panelcolor, setPanelcolor] = useState("#171717");
  const [textcolor, setTextcolor] = useState("#FFFFFF");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /* =====================================================
     IMAGE HANDLING
  ====================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  /* =====================================================
     FORM SUBMIT
  ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if (!image) {
      toast.error("Please upload a product image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // KEEPING YOUR EXISTING BACKEND FIELDS
      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount || 0);
      formData.append("bgcolor", bgcolor);
      formData.append("panelcolor", panelcolor);
      formData.append("textcolor", textcolor);
      formData.append("image", image);

      const res = await api.post(
        "/products/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        toast.success("Product published successfully!");

        setTimeout(() => {
          navigate("/shop");
        }, 700);
      } else {
        toast.error(
          res.data?.message ||
          "Failed to publish product."
        );
      }
    } catch (err) {
      console.error("Product creation error:", err);

      toast.error(
        err.response?.data?.message ||
        "Unable to publish product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DISCOUNT CALCULATION
  ====================================================== */

  const originalPrice = Number(price) || 0;
  const discountValue = Number(discount) || 0;

  const finalPrice =
    discountValue > 0
      ? Math.round(
        originalPrice -
        (originalPrice * discountValue) / 100
      )
      : originalPrice;

  /* =====================================================
     UI
  ====================================================== */

  return (
    <div
      className="
        min-h-screen
        bg-[#090909]
        text-white
        pt-28
        pb-20
        px-5
        sm:px-8
        lg:px-12
        relative
        overflow-hidden
      "
    >

      {/* =================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-orange-500/[0.07]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-200px]
          right-[-200px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-purple-500/[0.06]
          blur-[120px]
        "
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* =================================================
            TOP BAR
        ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            mb-10
          "
        >

          <button
            onClick={() => navigate("/profile")}
            className="
              group
              flex
              items-center
              gap-3
              text-zinc-500
              hover:text-white
              transition
              w-fit
            "
          >
            <span
              className="
                w-10
                h-10
                rounded-full
                border
                border-white/10
                flex
                items-center
                justify-center
                group-hover:bg-white
                group-hover:text-black
                transition
              "
            >
              <FiArrowLeft size={16} />
            </span>

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                font-bold
              "
            >
              Back to Profile
            </span>
          </button>


          {/* Preview */}

          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              hover:bg-white
              hover:text-black
              transition
              text-[10px]
              uppercase
              tracking-[0.2em]
              font-bold
            "
          >
            <FiEye size={15} />

            Preview Product
          </button>

        </div>


        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-12">

          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-orange-400
              "
            />

            <span
              className="
                text-orange-400
                text-[10px]
                font-black
                tracking-[0.35em]
                uppercase
              "
            >
              SCATCH / CREATOR STUDIO
            </span>
          </div>

          <h1
            className="
              text-5xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-[-0.07em]
              leading-[0.9]
              uppercase
            "
          >
            Create
            <br />

            <span className="text-zinc-600">
              Something
            </span>

            <br />

            Exceptional.
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-sm
              leading-7
              text-zinc-500
            "
          >
            Add a new piece to the SCATCH collection.
            Upload your product, define its visual identity
            and publish it directly to the storefront.
          </p>

        </div>


        {/* =================================================
            MAIN GRID
        ================================================== */}

        <form onSubmit={handleSubmit}>

          <div
            className="
              grid
              lg:grid-cols-[1.1fr_0.9fr]
              gap-6
              items-start
            "
          >

            {/* =================================================
                LEFT — IMAGE
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                rounded-[32px]
                border
                border-white/[0.08]
                bg-white/[0.035]
                backdrop-blur-xl
                p-5
                sm:p-7
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      font-black
                      text-zinc-500
                    "
                  >
                    01 / Visual
                  </p>

                  <h2
                    className="
                      text-xl
                      font-bold
                      mt-2
                    "
                  >
                    Product Image
                  </h2>

                </div>

                <FiImage
                  className="text-zinc-600"
                  size={22}
                />

              </div>


              {/* Upload Area */}

              <div
                className="
                  relative
                  min-h-[520px]
                  rounded-[25px]
                  overflow-hidden
                  border
                  border-white/[0.08]
                  bg-[#111]
                "
              >

                {imagePreview ? (

                  <>
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-contain
                        p-8
                      "
                    />

                    {/* Overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-transparent
                        to-transparent
                        pointer-events-none
                      "
                    />

                    {/* Image actions */}

                    <div
                      className="
                        absolute
                        bottom-5
                        left-5
                        right-5
                        flex
                        justify-between
                        items-center
                      "
                    >

                      <div>

                        <p
                          className="
                            text-white
                            text-sm
                            font-bold
                          "
                        >
                          {image.name}
                        </p>

                        <p
                          className="
                            text-zinc-500
                            text-[9px]
                            uppercase
                            tracking-widest
                            mt-1
                          "
                        >
                          {(image.size / 1024 / 1024).toFixed(2)}
                          {" "}MB
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="
                          w-11
                          h-11
                          rounded-full
                          bg-white
                          text-black
                          flex
                          items-center
                          justify-center
                          hover:bg-red-500
                          hover:text-white
                          transition
                        "
                      >
                        <FiX size={17} />
                      </button>

                    </div>

                  </>

                ) : (

                  <label
                    className="
                      absolute
                      inset-0
                      cursor-pointer
                      flex
                      flex-col
                      items-center
                      justify-center
                      group
                    "
                  >

                    <div
                      className="
                        w-20
                        h-20
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.04]
                        flex
                        items-center
                        justify-center
                        mb-6
                        group-hover:bg-white
                        group-hover:text-black
                        group-hover:scale-110
                        transition
                      "
                    >
                      <FiUploadCloud
                        size={28}
                      />
                    </div>

                    <h3
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Drop your product here
                    </h3>

                    <p
                      className="
                        text-zinc-600
                        text-xs
                        mt-2
                      "
                    >
                      or click to browse
                    </p>

                    <div
                      className="
                        mt-6
                        px-4
                        py-2
                        rounded-full
                        bg-white/[0.04]
                        text-[9px]
                        text-zinc-500
                        uppercase
                        tracking-widest
                        font-bold
                      "
                    >
                      JPG / PNG · MAX 5MB
                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                )}

              </div>

            </motion.div>


            {/* =================================================
                RIGHT — PRODUCT DETAILS
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="space-y-6"
            >

              {/* DETAILS CARD */}

              <div
                className="
                  rounded-[32px]
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  backdrop-blur-xl
                  p-6
                  sm:p-8
                "
              >

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    font-black
                    text-zinc-500
                  "
                >
                  02 / Product Details
                </p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    mt-2
                    mb-8
                  "
                >
                  Tell us about it.
                </h2>


                {/* NAME */}

                <div className="mb-6">

                  <label
                    className="
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      text-zinc-500
                      mb-2
                    "
                  >
                    Product Name
                  </label>

                  <div className="relative">

                    <FiBriefcase
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-zinc-600
                      "
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Linen Runway Shirt"
                      className="
                        w-full
                        h-14
                        rounded-2xl
                        bg-black/30
                        border
                        border-white/[0.08]
                        pl-12
                        pr-4
                        text-sm
                        font-semibold
                        outline-none
                        placeholder:text-zinc-700
                        focus:border-orange-400/50
                        transition
                      "
                    />

                  </div>

                </div>


                {/* PRICE + DISCOUNT */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  <div>

                    <label
                      className="
                        block
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        font-black
                        text-zinc-500
                        mb-2
                      "
                    >
                      Price
                    </label>

                    <div className="relative">

                      <FiDollarSign
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-zinc-600
                        "
                      />

                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value)
                        }
                        placeholder="1800"
                        className="
                          w-full
                          h-14
                          rounded-2xl
                          bg-black/30
                          border
                          border-white/[0.08]
                          pl-11
                          pr-3
                          text-sm
                          font-bold
                          outline-none
                          focus:border-orange-400/50
                        "
                      />

                    </div>

                  </div>


                  <div>

                    <label
                      className="
                        block
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        font-black
                        text-zinc-500
                        mb-2
                      "
                    >
                      Discount
                    </label>

                    <div className="relative">

                      <FiPercent
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-zinc-600
                        "
                      />

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(e.target.value)
                        }
                        placeholder="15"
                        className="
                          w-full
                          h-14
                          rounded-2xl
                          bg-black/30
                          border
                          border-white/[0.08]
                          pl-11
                          pr-3
                          text-sm
                          font-bold
                          outline-none
                          focus:border-orange-400/50
                        "
                      />

                    </div>

                  </div>

                </div>


                {/* PRICE PREVIEW */}

                {price && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    className="
                      mt-6
                      rounded-2xl
                      bg-white/[0.03]
                      border
                      border-white/[0.06]
                      p-4
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[8px]
                          uppercase
                          tracking-widest
                          text-zinc-600
                          font-bold
                        "
                      >
                        Customer pays
                      </p>

                      <p
                        className="
                          text-2xl
                          font-black
                          mt-1
                        "
                      >
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </p>

                    </div>

                    {discountValue > 0 && (

                      <span
                        className="
                          px-3
                          py-2
                          rounded-full
                          bg-green-500/10
                          text-green-400
                          text-[9px]
                          font-black
                        "
                      >
                        {discountValue}% OFF
                      </span>

                    )}

                  </motion.div>

                )}

              </div>


              {/* =================================================
                  COLORS
              ================================================== */}

              <div
                className="
                  rounded-[32px]
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  backdrop-blur-xl
                  p-6
                  sm:p-8
                "
              >

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    font-black
                    text-zinc-500
                  "
                >
                  03 / Visual Identity
                </p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    mt-2
                    mb-7
                  "
                >
                  Make it yours.
                </h2>


                <div className="space-y-4">

                  <ColorInput
                    label="Card Background"
                    value={bgcolor}
                    setValue={setBgcolor}
                  />

                  <ColorInput
                    label="Footer Panel"
                    value={panelcolor}
                    setValue={setPanelcolor}
                  />

                  <ColorInput
                    label="Footer Text"
                    value={textcolor}
                    setValue={setTextcolor}
                  />

                </div>

              </div>


              {/* =================================================
                  MINI PREVIEW
              ================================================== */}

              <div
                className="
                  rounded-[32px]
                  overflow-hidden
                  border
                  border-white/[0.08]
                "
              >

                <div
                  className="
                    px-6
                    py-4
                    bg-white/[0.035]
                    border-b
                    border-white/[0.06]
                  "
                >

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      font-black
                      text-zinc-500
                    "
                  >
                    04 / Live Preview
                  </p>

                </div>


                <div
                  className="
                    p-5
                    flex
                    items-center
                    gap-5
                  "
                  style={{
                    backgroundColor: bgcolor,
                  }}
                >

                  <div
                    className="
                      w-24
                      h-28
                      rounded-xl
                      overflow-hidden
                      bg-black/10
                      shrink-0
                    "
                  >

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-[8px]
                          uppercase
                          font-bold
                          text-black/30
                        "
                      >
                        No Image
                      </div>
                    )}

                  </div>


                  <div
                    className="
                      flex-1
                      rounded-2xl
                      p-4
                    "
                    style={{
                      backgroundColor: panelcolor,
                      color: textcolor,
                    }}
                  >

                    <p
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        opacity-60
                        font-bold
                      "
                    >
                      SCATCH
                    </p>

                    <h3
                      className="
                        font-black
                        text-sm
                        mt-2
                      "
                    >
                      {name || "LUXURY PRODUCT"}
                    </h3>

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mt-4
                      "
                    >

                      <span
                        className="
                          font-black
                          text-lg
                        "
                      >
                        ₹
                        {finalPrice
                          ? finalPrice.toLocaleString(
                            "en-IN"
                          )
                          : "1,800"}
                      </span>

                      <span
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-white
                          text-black
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FiShoppingBag
                          size={15}
                        />
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  PUBLISH BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-16
                  rounded-[22px]
                  bg-white
                  text-black
                  font-black
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  flex
                  items-center
                  justify-center
                  gap-3
                  hover:bg-orange-400
                  hover:text-white
                  hover:scale-[1.01]
                  transition-all
                  disabled:opacity-50
                  disabled:hover:scale-100
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        w-4
                        h-4
                        border-2
                        border-black/20
                        border-t-black
                        rounded-full
                        animate-spin
                      "
                    />

                    Publishing...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />

                    Publish To SCATCH
                  </>
                )}

              </button>

            </motion.div>

          </div>

        </form>

      </div>


      {/* =====================================================
          FULL PRODUCT PREVIEW MODAL
      ====================================================== */}

      <AnimatePresence>

        {showPreview && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setShowPreview(false)
            }
            className="
              fixed
              inset-0
              z-[9999]
              bg-black/80
              backdrop-blur-xl
              flex
              items-center
              justify-center
              p-5
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                relative
                w-full
                max-w-[420px]
                rounded-[32px]
                overflow-hidden
                shadow-2xl
              "
            >

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setShowPreview(false)
                }
                className="
                  absolute
                  top-4
                  right-4
                  z-20
                  w-10
                  h-10
                  rounded-full
                  bg-black/70
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <FiX />
              </button>


              {/* IMAGE */}

              <div
                className="
                  h-[430px]
                  flex
                  items-center
                  justify-center
                  p-8
                "
                style={{
                  backgroundColor: bgcolor,
                }}
              >

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={name}
                    className="
                      max-h-full
                      max-w-full
                      object-contain
                    "
                  />
                ) : (
                  <div
                    className="
                      text-black/30
                      text-xs
                      uppercase
                      tracking-widest
                      font-bold
                    "
                  >
                    Upload Image
                  </div>
                )}

              </div>


              {/* INFO */}

              <div
                className="
                  p-7
                "
                style={{
                  backgroundColor: panelcolor,
                  color: textcolor,
                }}
              >

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    opacity-50
                    font-black
                  "
                >
                  SCATCH COLLECTION
                </p>

                <h2
                  className="
                    text-2xl
                    font-black
                    mt-3
                  "
                >
                  {name || "Luxury Product"}
                </h2>

                <div
                  className="
                    flex
                    items-end
                    gap-3
                    mt-5
                  "
                >

                  <span
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    ₹
                    {finalPrice
                      ? finalPrice.toLocaleString(
                        "en-IN"
                      )
                      : "1,800"}
                  </span>

                  {discountValue > 0 && (
                    <span
                      className="
                        text-xs
                        opacity-40
                        line-through
                        mb-1
                      "
                    >
                      ₹
                      {originalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  )}

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};


/* =========================================================
   COLOR INPUT COMPONENT
========================================================= */

const ColorInput = ({
  label,
  value,
  setValue,
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        border-white/[0.07]
        bg-black/20
        p-3
      "
    >

      <div className="flex items-center gap-3">

        <input
          type="color"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          className="
            w-10
            h-10
            rounded-xl
            overflow-hidden
            border-0
            bg-transparent
            cursor-pointer
          "
        />

        <div>

          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.2em]
              font-black
              text-zinc-500
            "
          >
            {label}
          </p>

          <p
            className="
              text-xs
              font-bold
              mt-1
            "
          >
            {value.toUpperCase()}
          </p>

        </div>

      </div>


      <input
        type="text"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        className="
          w-24
          bg-transparent
          text-right
          text-xs
          font-bold
          outline-none
          text-zinc-400
        "
      />

    </div>
  );
};

export default AdminPage;