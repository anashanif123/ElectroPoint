import { useEffect, useState } from "react";
import { db, auth } from "../utils/utils"; // Firebase configuration
import { collection, onSnapshot } from "firebase/firestore";
import { Spin } from "antd";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";   

function ToShip() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a state variable to track the loading status

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    // Real-time listener for orders
    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const userId = auth.currentUser  ? auth.currentUser .uid : null; // Get current user's uid

        // Check if userId is available before filtering
        const ordersData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            status: doc.data().status || "in progress", // Set default status to 'in progress'
          }))
          .filter((order) => 
            order.cartItems && order.cartItems.length > 0 && order.cartItems[0].userId === userId
          ); // Filter orders by user's uid

        setOrders(ordersData);
        setIsLoading(false); // Set isLoading to false when data is received
        console.log("Real-time ordersData ==>", ordersData);
      },
      (error) => {
        console.error("Error fetching orders: ", error);
        setIsLoading(false); // Set isLoading to false when an error occurs
      }
    );

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Helper function to return the icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "On Way":
        return <CarOutlined className="text-blue-500" />;
      case "Delivered":
        return <CheckCircleOutlined className="text-green-500" />;
      default:
        return <ClockCircleOutlined className="text-yellow-500" />; // Default to 'In Progress' icon
    }
  };

  return (
    <div className="ship p-6">
      <h2 className="text-2xl font-bold mb-4 text-center bg-blue-500 text-white py-2 rounded">
        Order In Progress
      </h2>
      {isLoading ? (
        <div className="col-span-full text-center text-gray-500">
          <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No orders in progress
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-lg overflow-hidden w-full"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="w-full">
                    {order.cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center"
                      >
                        <img
                          src={item.image}
                          alt={`Order ${order.id}`}
                          style={{ width: "3cm", height: "3cm" }}
                          className="object-cover object-center"
                        />

                        <div className="p-4 w-full sm:w-2/3">
                          <h3 className="text-lg font-semibold">
                            Order Name: {item.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-right sm:w-auto flex flex-col items-end">
                    <p className="text-gray-500 font-semibold mb-1">Status</p>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <p className="ml -2">{order.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ToShip;