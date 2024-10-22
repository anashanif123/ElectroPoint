import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js"; // Import your Firebase config
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cart"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched cart items:", items); // Log fetched items
        setCartItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const handleRemove = async (id) => {
    try {
      await db.collection("cart").doc(id).delete();
      setCartItems(cartItems.filter(item => item.id !== id)); // Remove item from local state
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <ul className="space-y-4">
        {cartItems.map(item => (
          <li key={item.id} className="flex items-center justify-between border p-4 rounded">
            <div className="flex items-center">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-red-500">${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <button 
              onClick={() => handleRemove(item.id)} 
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
