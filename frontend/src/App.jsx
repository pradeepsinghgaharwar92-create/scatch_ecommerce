import React from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LandingPage from "./pages/LandingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Protected from "./components/common/Protected";
import ScrollProgress from "./components/common/ScrollProgress";
import CookieBanner from "./components/common/CookieBanner";
import OfferPopup from "./components/common/OfferPopup";
import WhatsAppButton from "./components/common/WhatsAppButton";

import "./App.css";

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      <ScrollProgress />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {!isAuthPage && <Navbar />}

      <AnimatePresence mode="wait">

        <motion.main
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -12,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <Routes>

            <Route
              path="/"
              element={<LandingPage />}
            />

            <Route
              path="/home"
              element={
                <Protected>
                  <HomePage />
                </Protected>
              }
            />

            <Route
              path="/shop"
              element={
                <Protected>
                  <ShopPage />
                </Protected>
              }
            />

            <Route
              path="/product/:id"
              element={
                <Protected>
                  <ProductDetailsPage />
                </Protected>
              }
            />

            <Route
              path="/cart"
              element={
                <Protected>
                  <CartPage />
                </Protected>
              }
            />

            <Route
              path="/wishlist"
              element={
                <Protected>
                  <WishlistPage />
                </Protected>
              }
            />

            <Route
              path="/profile"
              element={
                <Protected>
                  <ProfilePage />
                </Protected>
              }
            />

            <Route
              path="/admin/create-product"
              element={
                <Protected>
                  <AdminPage />
                </Protected>
              }
            />

          </Routes>

        </motion.main>

      </AnimatePresence>

      {!isAuthPage && <Footer />}

      <CookieBanner />
      <OfferPopup />
      <WhatsAppButton />

    </div>
  );
}

export default App;