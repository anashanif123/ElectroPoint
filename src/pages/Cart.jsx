import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js"; // Import your Firebase config
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"; // Firestore functions
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

import { Link } from "react-router-dom";
import { DeleteFilled, DeleteOutlined } from "@ant-design/icons";
import { Spin } from "antd";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Get the authenticated user

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
        fetchCartItems(user.uid); // Fetch cart items only when the user is authenticated
      } else {
        setLoading(false); // Stop loading if the user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [auth]);

  const removeFromCart = async (itemId) => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "cart", itemId)); // Delete the item from Firestore
        setCartItems(cartItems.filter((item) => item.id !== itemId)); // Update local state
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (auth.currentUser && newQuantity > 0) {
      try {
        const itemRef = doc(db, "cart", itemId);
        await updateDoc(itemRef, { quantity: newQuantity }); // Update the quantity in Firestore
        setCartItems(
          cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        ); // Update local state
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else if (newQuantity <= 0) {
      removeFromCart(itemId); // Remove item if quantity is 0 or less
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Spin size="large"/></div>;
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
      <div className="relative text-center">
        
           <hr />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
            <h1 className="text-4xl font-bold">Cart</h1>
          </div>
        </div>
      
      <div className="mx-auto px-4 py-10 flex flex-wrap">
  <div className="w-full md:w-2/3">
    <AnimatePresence>
      {cartItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className={`bg-white shadow-lg rounded-lg p-6 mb-4 transform hover:scale-105 transition-transform duration-500 ease-in-out ${index === cartItems.length - 1 ? 'mb-8' : ''}`} // Add extra margin-bottom to the last item
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-40 h-40 object-cover rounded mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className="text-gray-600">
                  Quantity:
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="bg-gray-300 text-gray-800 py-1 px-3 mx-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="bg-gray-300 text-gray-800 py-1 px-3 mx-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    +
                  </button>
                </p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              style={{ color: "blue" }}
              className="bg-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
            >
              <DeleteFilled />
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
<hr />
  {/* Checkout Section */}
  <div className="w-full md:w-1/3"> {/* Increased margin-top here */}
    <div
     
      className=" bg-blue-50 h-80 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
    >
      <h3 className="text-4xl text-center font-semibold">Card Totals</h3>
      <p className="text-xl text-center mb-2 mt-12">
        Total Price: ${calculateTotalPrice()}
      </p>
      <Link to={"/Checkout"}>
        <button
          
          className=" text-white py-2 px-4 rounded-xl mt-4  bg-blue-600 transition-colors border border-blue"
        >
          Checkout
        </button>
      </Link>
    </div>
  </div>
</div>
    </>
  );
}

export default CartPage;
