import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion"; // Import framer-motion for animations

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const q = query(collection(db, "wishlist"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishlist(products);
      }
    };

    fetchWishlist();
  }, [auth.currentUser]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">No products in your wishlist.</p>
      ) : (
        <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <motion.li 
              key={item.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }} // Animation on hover
            >
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-800 font-medium">Price: ${item.price}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

export default Wishlist;
