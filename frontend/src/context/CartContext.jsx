import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [bill, setBill] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data && Array.isArray(res.data.cartItems)) {
        setCartItems(res.data.cartItems);
        setBill(res.data.bill);
      } else {
        setCartItems([]);
        setBill(0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setBill(0);
    }
  }, [user]);

  const addToCart = async (productId) => {
    try {
      toast.loading('Adding to cart...', { id: 'add-cart' });
      // Call add to cart, which adds the product to cart behind the scenes
      await api.get(`/addtocart/${productId}`);
      await fetchCart();
      toast.success('Added to cart!', { id: 'add-cart' });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart', { id: 'add-cart' });
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await api.get(`/cart/increase/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await api.get(`/cart/decrease/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.get('/clearcart');
      if (res.data && res.data.success) {
        setCartItems([]);
        setBill(0);
        toast.success('Cart cleared!');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      bill,
      loading,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
