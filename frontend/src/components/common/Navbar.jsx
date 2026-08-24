import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Navbar = () => {

  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);

  const navItems = [
    {
      name: "Home",
      path: "/home",
    },
    {
      name: "Collection",
      path: "/shop",
    },
    {
      name: "Wishlist",
      path: "/wishlist",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  return (

    <motion.nav
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        fixed
        top-4
        left-1/2
        -translate-x-1/2
        z-[90]
        w-[calc(100%-24px)]
        max-w-7xl
        transition-all
        duration-500
        rounded-[22px]
        border
        ${scrolled
          ? "bg-black/75 backdrop-blur-2xl border-white/15 shadow-2xl py-2"
          : "bg-black/40 backdrop-blur-xl border-white/10 py-3"
        }
      `}
    >

      <div className="px-5 md:px-7 flex items-center justify-between">

        {/* LOGO */}

        <Link to="/home">

          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
            }}
            className="text-xl font-black tracking-[-0.06em]"
          >
            SCATCH
            <span className="text-purple-400">.</span>
          </motion.div>

        </Link>


        {/* DESKTOP NAV */}

        <div className="hidden md:flex items-center gap-8">

          {navItems.map((item) => {

            const active =
              location.pathname === item.path;

            return (

              <Link
                key={item.path}
                to={item.path}
                className="relative"
              >

                <motion.span
                  whileHover={{
                    y: -2,
                  }}
                  className={`
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    font-bold
                    transition-colors
                    ${active
                      ? "text-white"
                      : "text-white/45 hover:text-white"
                    }
                  `}
                >
                  {item.name}
                </motion.span>

                {active && (
                  <motion.div
                    layoutId="navbarActive"
                    className="
                      absolute
                      -bottom-2
                      left-0
                      right-0
                      h-[2px]
                      rounded-full
                      bg-white
                    "
                  />
                )}

              </Link>

            );

          })}

        </div>


        {/* RIGHT ACTIONS */}

        <div className="flex items-center gap-2">

          <NavIcon
            icon={<FiSearch size={16} />}
          />

          <Link to="/wishlist">
            <NavIcon
              icon={<FiHeart size={16} />}
            />
          </Link>

          <Link to="/cart">
            <NavIcon
              icon={<FiShoppingBag size={16} />}
            />
          </Link>

          <Link to="/profile">
            <NavIcon
              icon={<FiUser size={16} />}
            />
          </Link>


          {/* MOBILE */}

          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="
              md:hidden
              w-9
              h-9
              rounded-full
              bg-white/10
              flex
              items-center
              justify-center
            "
          >
            {mobileOpen ? (
              <FiX />
            ) : (
              <FiMenu />
            )}
          </motion.button>

        </div>

      </div>


      {/* MOBILE MENU */}

      {mobileOpen && (

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
          className="
            md:hidden
            overflow-hidden
            border-t
            border-white/10
            mt-3
          "
        >

          <div className="p-5 space-y-4">

            {navItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block
                  text-sm
                  font-bold
                  text-white/60
                  hover:text-white
                "
              >
                {item.name}
              </Link>

            ))}

          </div>

        </motion.div>

      )}

    </motion.nav>
  );
};


const NavIcon = ({ icon }) => {

  return (

    <motion.button
      whileHover={{
        scale: 1.08,
        backgroundColor: "rgba(255,255,255,0.12)",
      }}
      whileTap={{
        scale: 0.9,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className="
        w-9
        h-9
        rounded-full
        bg-white/5
        border
        border-white/5
        flex
        items-center
        justify-center
        text-white/70
      "
    >
      {icon}
    </motion.button>

  );

};

export default Navbar;