import React, { useEffect, useState } from "react";
import { db } from "../utils/utils"; // Firebase initialization
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { Spin } from "antd";
import { auth } from "../utils/utils"; // Firebase authentication
import { signOut } from "firebase/auth";
import { AiOutlineDashboard, AiOutlineUser, AiOutlineShoppingCart } from 'react-icons/ai'; // Icons for Sidebar
import { Bar, Pie } from 'react-chartjs-2'; // Import chart components
import 'chart.js/auto';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]); // State for users
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard"); // State for page navigation
  const [cardDetails, setCardDetails] = useState(null); // State for card details

  // Fetch orders when activePage is "orders" or "dashboard"
  useEffect(() => {
    if (activePage === "orders" || activePage === "dashboard") {
      const ordersRef = collection(db, "orders");

      const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [activePage]);

  // Fetch users when activePage is "users" or "dashboard"
  useEffect(() => {
    if (activePage === "users" || activePage === "dashboard") {
      const usersRef = collection(db, "users");

      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [activePage]);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      window.location.href = "/login"; // Replace with your login page URL
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Loading state
  if (loading && (activePage === "orders" || activePage === "users" || activePage === "dashboard")) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Analytics data
  const totalRevenue = orders.reduce((sum, order) => {
    const price = parseFloat(order.totalPrice) || 0; // Ensure totalPrice is a valid number
    return sum + price;
  }, 0);

  // Data for pie chart of most popular products
  const productFrequency = {};
  orders.forEach((order) => {
    order.cartItems.forEach((item) => {
      productFrequency[item.title] = (productFrequency[item.title] || 0) + item.quantity;
    });
  });

  const pieData = {
    labels: Object.keys(productFrequency),
    datasets: [
      {
        label: 'Products',
        data: Object.values(productFrequency),
        backgroundColor: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
        hoverBackgroundColor: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']
      },
    ],
  };

  // Initialize orderStatuses
  const orderStatuses = {};
  orders.forEach((order) => {
    const status = order.status || "Unknown"; // Handle undefined status
    orderStatuses[status] = (orderStatuses[status] || 0) + 1; // Count each status
  });

  // Data for bar chart of order statuses
  const barData = {
    labels: Object.keys(orderStatuses),
    datasets: [
      {
        label: 'Order Status Breakdown',
        data: Object.values(orderStatuses),
        backgroundColor: '#4caf50',
      },
    ],
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="p-6 bg-gray-100">
            <h2 className="text-3xl font-semibold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard Cards */}
              <div 
                className="bg-blue-500 text-white shadow-lg p-6 rounded-xl cursor-pointer hover:shadow-xl transition" 
                onClick={() => setCardDetails({ title: 'Total Orders', value: orders.length })}
              >
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="mt-4 text-2xl">{orders.length}</p>
              </div>
              <div 
                className="bg-green-500 text-white shadow-lg p-6 rounded-xl cursor-pointer hover:shadow-xl transition" 
                onClick={() => setCardDetails({ title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` })}
              >
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="mt-4 text-2xl">${totalRevenue.toFixed(2)}</p>
              </div>
              <div 
                className="bg-purple-500 text-white shadow-lg p-6 rounded-xl cursor-pointer hover:shadow-xl transition" 
                onClick={() => setCardDetails({ title: 'Total Users', value: users.length })}
              >
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="mt-4 text-2xl">{users.length}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              {/* Order Status Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
                <Bar data={barData} />
              </div>

              {/* Most Popular Products Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Most Popular Products</h3>
                <Pie data={pieData} />
              </div>
            </div>

            {/* Card Detail Modal */}
            {cardDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">{cardDetails.title}</h2>
                  <p className="mt-2 text-lg">{cardDetails.value}</p>
                  <button 
                    onClick={() => setCardDetails(null)} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "orders":
        return (
          <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-center">Orders Dashboard</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              {orders.length === 0 ? (
                <Spin />
              ) : (
                <table className="min-w-full bg-white border rounded-lg">
                  <thead>
                    <tr className="bg-blue-500 text-white text-left">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer Name</th>
                      <th className="py-4 px-6">Items</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-100">
                        <td className="py-4 px-6 border-b">{order.id}</td>
                        <td className="py-4 px-6 border-b">{order.userDetails.name}</td>
                        <td className="py-4 px-6 border-b">
                          {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? (
                            <ul>
                              {order.cartItems.map((item, index) => (
                                <li key={index}>
                                  {item.title} - {item.quantity}{" "}
                                  {item.quantity > 1 ? "pcs" : "pc"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No items available</p>
                          )}
                        </td>
                        <td className="py-4 px-6 border-b">${order.totalPrice}</td>
                        <td className="py-4 px-6 border-b">{order.status}</td>
                        <td className="py-4 px-6 border-b">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-center">Users Dashboard</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              {users.length === 0 ? (
                <Spin />
              ) : (
                <table className="min-w-full bg-white border rounded-lg">
                  <thead>
                    <tr className="bg-blue-500 text-white text-left">
                      <th className="py-4 px-6">User ID</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="py-4 px-6 border-b">{user.id}</td>
                        <td className="py-4 px-6 border-b">{user.username}</td>
                        <td className="py-4 px-6 border-b">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="bg-gray-900 w-64 h-screen p-5">
        <h1 className="text-white text-2xl font-semibold mb-8">Admin Panel</h1>
        <ul>
          <li onClick={() => setActivePage("dashboard")} className="text-white cursor-pointer mb-4">
            <AiOutlineDashboard /> Dashboard
          </li>
          <li onClick={() => setActivePage("orders")} className="text-white cursor-pointer mb-4">
            <AiOutlineShoppingCart /> Orders
          </li>
          <li onClick={() => setActivePage("users")} className="text-white cursor-pointer mb-4">
            <AiOutlineUser /> Users
          </li>
        </ul>
        <button onClick={handleLogout} className="mt-8 text-white bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <div className="flex-grow p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
