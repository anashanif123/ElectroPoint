import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { DeleteFilled } from "@ant-design/icons";
import { Spin } from "antd";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchCartItems = async (userId) => {
      try {
        const q = query(collection(db, "cart"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCartItems(user.uid); 
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const removeFromCart = async (itemId) => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "cart", itemId)); 
        setCartItems(cartItems.filter((item) => item.id !== itemId)); 
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (auth.currentUser && newQuantity > 0) {
      try {
        const itemRef = doc(db, "cart", itemId);
        await updateDoc(itemRef, { quantity: newQuantity });
        setCartItems(
          cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else if (newQuantity <= 0) {
      removeFromCart(itemId); 
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        Your cart is empty.
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="py-6 text-center">
        <h1 className="text-4xl font-bold   bg-gradient-to-b from-white to-blue-200 p-8 rounded-lg shadow-lg">Your Cart</h1>
        <p className="text-gray-500 mt-2">Review your items and proceed to checkout</p>
      </div>

      {/* Cart & Checkout Section */}
      <div className="container mx-auto px-4 py-10 flex flex-wrap justify-between">
        <div className="w-full md:w-2/3">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-lg rounded-lg mb-6 p-6 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
                    <p className="text-gray-500">Price: ${item.price}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <DeleteFilled />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Checkout Section */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 h-auto flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Order Summary</h3>
            <p className="text-lg text-gray-600">Subtotal: ${calculateTotalPrice()}</p>
            <p className="text-lg text-gray-600 mt-2">Shipping: Free</p>
            <p className="text-xl font-bold text-gray-700 mt-4">
              Total: ${calculateTotalPrice()}
            </p>
          </div>
          <Link to="/Checkout">
            <button className="mt-6 bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default CartPage;
