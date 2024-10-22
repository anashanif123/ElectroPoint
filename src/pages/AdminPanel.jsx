import React, { useEffect, useState } from "react";
import { db } from "../utils/utils"; // Firebase initialization
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { Spin } from "antd";
import { auth } from "../utils/utils"; // Firebase authentication
import { signOut } from "firebase/auth";


function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    // Real-time listener for orders
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        status: newStatus,
      });
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      // Redirect to login page or homepage
      window.location.href = "/login"; // Replace with your login page URL
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-100 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center bg-blue-600 text-white py-2 rounded">
        Admin Order Management
      </h2>
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer Name</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.userDetails.name}</td>
                <td className="py-2 px-4 border-b">
                  {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? (
                    <ul>
                      {order.cartItems.map((item, index) => (
                        <li key={index}>
                          {item.title} - {item.quantity} {item.quantity > 1 ? "pcs" : "pc"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items available</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b">${order.totalPrice}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b88e2f] focus:border-transparent"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="On Way">On Way</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;