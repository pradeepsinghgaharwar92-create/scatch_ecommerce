import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiLogOut,
  FiCamera,
  FiEdit3,
  FiArrowUpRight,
  FiSettings,
  FiShield,
  FiClock,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* =====================================================
     USER DATA
  ===================================================== */

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("profilePhoto") || "";
  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    username:
      user?.username ||
      user?.fullname ||
      user?.name ||
      "SCATCH MEMBER",

    email:
      user?.email ||
      user?.gmail ||
      "member@scatch.com",

    contact:
      user?.contact ||
      user?.phone ||
      "Not added",

    bio:
      user?.bio ||
      "Building my own identity, one piece at a time.",
  });

  /* =====================================================
     SAVE PROFILE PHOTO
  ===================================================== */

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image should be less than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setProfilePhoto(image);
      localStorage.setItem("profilePhoto", image);

      toast.success("Profile photo updated!");
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     REMOVE PHOTO
  ===================================================== */

  const removePhoto = () => {
    setProfilePhoto("");

    localStorage.removeItem("profilePhoto");

    toast.success("Profile photo removed.");
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email,
      contact: formData.contact,
      bio: formData.bio,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setIsEditing(false);

    toast.success("Profile updated successfully!");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    navigate("/login");
  };

  /* =====================================================
     NAME
  ===================================================== */

  const displayName =
    formData.username || "SCATCH MEMBER";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  /* =====================================================
     ANIMATIONS
  ===================================================== */

  const container = {
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

  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    show: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-hidden relative">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-60
            -left-60
            w-[700px]
            h-[700px]
            rounded-full
            bg-red-900/20
            blur-[160px]
          "
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[30%]
            -right-60
            w-[650px]
            h-[650px]
            rounded-full
            bg-purple-900/10
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,1) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-8">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            flex
            items-center
            justify-between
            mb-10
          "
        >

          <div>

            <div className="flex items-center gap-3 mb-2">

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-red-600
                  shadow-[0_0_15px_rgba(220,38,38,.8)]
                "
              />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-red-500
                  font-black
                "
              >
                Private Space
              </span>

            </div>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-black
                tracking-[-0.06em]
                uppercase
              "
            >
              My Profile
            </h1>

            <p className="mt-2 text-xs text-white/35">
              Your personal SCATCH space.
            </p>

          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              rotate: 5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setIsEditing(!isEditing)}
            className="
              w-12
              h-12
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              backdrop-blur-xl
              flex
              items-center
              justify-center
              text-white/70
              hover:bg-white
              hover:text-black
              transition
            "
          >
            <FiSettings size={17} />
          </motion.button>

        </motion.div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="
            grid
            lg:grid-cols-[360px_1fr]
            gap-6
          "
        >

          {/* =====================================================
              PROFILE CARD
          ===================================================== */}

          <motion.section
            variants={item}
            className="
              relative
              overflow-hidden
              rounded-[35px]
              border
              border-white/[0.08]
              bg-white/[0.035]
              backdrop-blur-2xl
              min-h-[570px]
              p-7
              flex
              flex-col
            "
          >

            {/* Card glow */}

            <div
              className="
                absolute
                -top-32
                left-1/2
                -translate-x-1/2
                w-72
                h-72
                rounded-full
                bg-red-700/20
                blur-[100px]
              "
            />

            {/* Profile top */}

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-white/30
                    font-black
                  "
                >
                  SCATCH ID
                </span>

                <span
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                    text-[7px]
                    uppercase
                    tracking-widest
                    font-black
                  "
                >
                  Active
                </span>

              </div>

              {/* PROFILE IMAGE */}

              <div className="flex justify-center mt-12">

                <div className="relative">

                  {/* rotating ring */}

                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="
                      absolute
                      -inset-3
                      rounded-full
                      border
                      border-dashed
                      border-red-600/30
                    "
                  />

                  <div
                    className="
                      relative
                      w-36
                      h-36
                      rounded-full
                      overflow-hidden
                      border
                      border-white/10
                      bg-gradient-to-br
                      from-red-800
                      to-red-950
                      shadow-[0_25px_80px_rgba(220,38,38,.25)]
                    "
                  >

                    {profilePhoto ? (

                      <img
                        src={profilePhoto}
                        alt="Profile"
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
                          text-5xl
                          font-black
                        "
                      >
                        {initials || "S"}
                      </div>

                    )}

                  </div>

                  {/* CAMERA */}

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      absolute
                      bottom-1
                      right-1
                      w-11
                      h-11
                      rounded-full
                      bg-white
                      text-black
                      border-4
                      border-[#111]
                      flex
                      items-center
                      justify-center
                      shadow-xl
                    "
                  >
                    <FiCamera size={16} />
                  </motion.button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </div>

              </div>

              {/* NAME */}

              <div className="text-center mt-9">

                <h2
                  className="
                    text-2xl
                    font-black
                    uppercase
                    tracking-[-0.04em]
                  "
                >
                  {displayName}
                </h2>

                <p
                  className="
                    mt-2
                    text-[8px]
                    uppercase
                    tracking-[0.35em]
                    text-red-500
                    font-black
                  "
                >
                  SCATCH MEMBER
                </p>

              </div>

              {/* BIO */}

              <p
                className="
                  text-center
                  text-xs
                  text-white/35
                  leading-6
                  mt-6
                  px-5
                "
              >
                {formData.bio}
              </p>

              {/* PHOTO BUTTONS */}

              <div className="flex gap-2 mt-7">

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-white
                    text-black
                    text-[8px]
                    uppercase
                    tracking-widest
                    font-black
                    hover:bg-red-500
                    hover:text-white
                    transition
                  "
                >
                  Change Photo
                </button>

                {profilePhoto && (

                  <button
                    onClick={removePhoto}
                    className="
                      w-12
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      text-white/40
                      hover:text-red-400
                      hover:border-red-500/30
                      transition
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FiTrash2 size={14} />
                  </button>

                )}

              </div>

            </div>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="
                relative
                mt-auto
                w-full
                py-4
                rounded-2xl
                border
                border-red-500/10
                bg-red-500/[0.06]
                text-red-500
                text-[9px]
                uppercase
                tracking-[0.2em]
                font-black
                flex
                items-center
                justify-center
                gap-3
                hover:bg-red-500
                hover:text-white
                transition
              "
            >
              <FiLogOut />
              Logout
            </button>

          </motion.section>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div className="space-y-6">

            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}

            <motion.section
              variants={item}
              className="
                rounded-[35px]
                border
                border-white/[0.08]
                bg-white/[0.035]
                backdrop-blur-2xl
                p-6
                md:p-8
              "
            >

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-4
                  mb-7
                "
              >

                <div>

                  <p
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.35em]
                      text-red-500
                      font-black
                    "
                  >
                    Personal Information
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                      uppercase
                      tracking-[-0.04em]
                      mt-2
                    "
                  >
                    Account Details
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setIsEditing(!isEditing)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    text-[8px]
                    uppercase
                    tracking-widest
                    font-black
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  <FiEdit3 size={13} />
                  {isEditing ? "Close" : "Edit"}
                </button>

              </div>

              {isEditing ? (

                <div className="space-y-5">

                  <InputField
                    label="Name"
                    value={formData.username}
                    icon={<FiUser />}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        username: value,
                      })
                    }
                  />

                  <InputField
                    label="Email"
                    value={formData.email}
                    icon={<FiMail />}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        email: value,
                      })
                    }
                  />

                  <InputField
                    label="Contact"
                    value={formData.contact}
                    icon={<FiPhone />}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        contact: value,
                      })
                    }
                  />

                  <div>

                    <label
                      className="
                        block
                        text-[8px]
                        uppercase
                        tracking-widest
                        text-white/30
                        mb-2
                      "
                    >
                      Bio
                    </label>

                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bio: e.target.value,
                        })
                      }
                      rows={3}
                      className="
                        w-full
                        rounded-2xl
                        bg-black/30
                        border
                        border-white/10
                        px-5
                        py-4
                        text-sm
                        outline-none
                        focus:border-red-500/40
                        resize-none
                      "
                    />

                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="
                      w-full
                      py-4
                      rounded-2xl
                      bg-white
                      text-black
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      hover:bg-red-500
                      hover:text-white
                      transition
                    "
                  >
                    Save Changes
                  </button>

                </div>

              ) : (

                <div className="grid md:grid-cols-3 gap-3">

                  <InfoCard
                    icon={<FiUser />}
                    label="Name"
                    value={formData.username}
                  />

                  <InfoCard
                    icon={<FiMail />}
                    label="Email"
                    value={formData.email}
                  />

                  <InfoCard
                    icon={<FiPhone />}
                    label="Contact"
                    value={formData.contact}
                  />

                </div>

              )}

            </motion.section>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <StatCard
                icon={<FiShoppingBag />}
                number="0"
                label="Bag Items"
              />

              <StatCard
                icon={<FiHeart />}
                number="0"
                label="Wishlist"
              />

              <StatCard
                icon={<FiPackage />}
                number="0"
                label="Orders"
              />

              <StatCard
                icon={<FiClock />}
                number="0"
                label="Saved"
              />

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <motion.section
              variants={item}
              className="
                rounded-[35px]
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-6
                md:p-8
              "
            >

              <div className="mb-7">

                <p
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.35em]
                    text-red-500
                    font-black
                  "
                >
                  Your Space
                </p>

                <h2
                  className="
                    text-2xl
                    font-black
                    uppercase
                    tracking-[-0.04em]
                    mt-2
                  "
                >
                  Quick Actions
                </h2>

              </div>

              <div className="grid sm:grid-cols-2 gap-3">

                <QuickAction
                  icon={<FiShoppingBag />}
                  title="Shopping Bag"
                  description="View your selected pieces"
                  onClick={() => navigate("/cart")}
                />

                <QuickAction
                  icon={<FiHeart />}
                  title="Wishlist"
                  description="Your saved collection"
                  onClick={() =>
                    toast("Wishlist coming soon.")
                  }
                />

                <QuickAction
                  icon={<FiPackage />}
                  title="Orders"
                  description="Track your purchases"
                  onClick={() =>
                    toast("Order history coming soon.")
                  }
                />

                <QuickAction
                  icon={<FiArrowUpRight />}
                  title="Explore Shop"
                  description="Discover the latest edit"
                  onClick={() => navigate("/shop")}
                />

              </div>

            </motion.section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <motion.div
              variants={item}
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-green-500/10
                bg-green-500/[0.03]
                px-5
                py-4
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-green-500/10
                  text-green-400
                  flex
                  items-center
                  justify-center
                "
              >
                <FiShield size={16} />
              </div>

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    font-black
                  "
                >
                  Account Protected
                </p>

                <p className="text-[10px] text-white/30 mt-1">
                  Your SCATCH account is secured.
                </p>

              </div>

              <div className="ml-auto">

                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-green-400
                    block
                    shadow-[0_0_12px_rgba(74,222,128,.8)]
                  "
                />

              </div>

            </motion.div>

          </div>

        </motion.div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="text-center mt-14 pb-5">

          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.4em]
              text-white/15
              font-black
            "
          >
            SCATCH / PRIVATE MEMBER SPACE / 2026
          </p>

        </div>

      </main>
    </div>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  value,
  icon,
  onChange,
}) => {
  return (
    <div>

      <label
        className="
          block
          text-[8px]
          uppercase
          tracking-widest
          text-white/30
          mb-2
        "
      >
        {label}
      </label>

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-black/30
          border
          border-white/10
          px-5
          focus-within:border-red-500/40
        "
      >

        <span className="text-red-500">
          {icon}
        </span>

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            w-full
            bg-transparent
            py-4
            text-sm
            outline-none
          "
        />

      </div>

    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-2xl
        bg-black/20
        border
        border-white/[0.06]
        p-5
      "
    >

      <div
        className="
          w-9
          h-9
          rounded-xl
          bg-red-500/[0.07]
          text-red-500
          flex
          items-center
          justify-center
          mb-4
        "
      >
        {icon}
      </div>

      <p
        className="
          text-[7px]
          uppercase
          tracking-widest
          text-white/25
          font-black
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          font-bold
          mt-2
          truncate
        "
      >
        {value}
      </p>

    </motion.div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  number,
  label,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="
        rounded-[25px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-5
        relative
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          -right-5
          -top-5
          w-20
          h-20
          rounded-full
          bg-red-600/10
          blur-2xl
        "
      />

      <div className="relative">

        <div
          className="
            w-9
            h-9
            rounded-xl
            bg-white/[0.04]
            border
            border-white/[0.06]
            flex
            items-center
            justify-center
            text-red-500
          "
        >
          {icon}
        </div>

        <p
          className="
            text-2xl
            font-black
            mt-5
          "
        >
          {number}
        </p>

        <p
          className="
            text-[7px]
            uppercase
            tracking-widest
            text-white/25
            mt-1
          "
        >
          {label}
        </p>

      </div>

    </motion.div>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.015,
        x: 3,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="
        text-left
        w-full
        p-5
        rounded-2xl
        border
        border-white/[0.07]
        bg-black/20
        hover:bg-white/[0.06]
        transition
        flex
        items-center
        gap-4
      "
    >

      <div
        className="
          shrink-0
          w-11
          h-11
          rounded-xl
          bg-red-500/[0.07]
          text-red-500
          flex
          items-center
          justify-center
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p
          className="
            text-[10px]
            uppercase
            tracking-widest
            font-black
          "
        >
          {title}
        </p>

        <p
          className="
            text-[9px]
            text-white/25
            mt-1
            truncate
          "
        >
          {description}
        </p>

      </div>

      <FiArrowUpRight
        className="
          ml-auto
          shrink-0
          text-white/20
        "
        size={15}
      />

    </motion.button>
  );
};

export default Profile;