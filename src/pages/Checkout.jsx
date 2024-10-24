import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js"; // Import your Firebase config
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import { collection, query, where, getDocs, addDoc, writeBatch } from "firebase/firestore"; // Firestore functions
import jsPDF from "jspdf"; // Import jsPDF
import Footer from "../components/Footer.jsx";
import Benefits from "../components/Benefit.jsx";
import { message, Spin } from "antd";
// import backgroundImage from "../assets/pics/Rectangle 1.jpg";
import { useNavigate } from "react-router";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    whatsapp: "", // Add WhatsApp number
  });
  const navigate = useNavigate();

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

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleCheckout = async () => {
    const { name, email, address, whatsapp } = userDetails;

    // Simple form validation
    if (!name || !email || !address || !whatsapp) {
      message.error("Please fill in all the required fields (Name, Email, Address, WhatsApp).");
      return; // Stop the function if validation fails
    }

    try {
      const orderData = {
        userDetails,
        cartItems,
        totalPrice: calculateTotalPrice(),
        createdAt: new Date(),
      };
      await addDoc(collection(db, "orders"), orderData);
      console.log("Order placed successfully:", orderData);
      message.success("Order placed successfully!");

      // Send order details to WhatsApp
      sendWhatsAppMessage(orderData);

      // Generate the product slip
      generatePDF(orderData);

      // Clear the cart after placing the order
      await clearCart();
      navigate('/ToShip');
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order. Please try again.");
    }
  };

  const clearCart = async () => {
    try {
      const q = query(collection(db, "cart"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      // Create a batch to delete cart items
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit(); // Commit the batch delete
      console.log("Cart cleared successfully.");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const generatePDF = (orderData) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Colors
    const backgroundColor = [240, 248, 255]; // Light blue-gray
    const primaryTextColor = [33, 37, 41]; // Dark gray
    const secondaryTextColor = [108, 117, 125]; // Medium gray
    const highlightColor = [52, 152, 219]; // Blue for highlights
  
    // Background Color
    doc.setFillColor(...backgroundColor);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
    // Add header
    doc.setFontSize(24);
    doc.setTextColor(...highlightColor);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", margin, margin + 10);
  
    // Order Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryTextColor);
    doc.text(`Order Date: ${orderData.createdAt.toLocaleDateString()}`, margin, margin + 25);
    doc.text(`Order Number: #${Math.floor(Math.random() * 100000)}`, margin, margin + 30);
  
    // Customer Info
    doc.setTextColor(...secondaryTextColor);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information:", margin, margin + 45);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryTextColor);
    doc.text(`Name: ${orderData.userDetails.name}`, margin, margin + 50);
    doc.text(`Email: ${orderData.userDetails.email}`, margin, margin + 55);
    doc.text(`Address: ${orderData.userDetails.address}`, margin, margin + 60);
    doc.text(`WhatsApp: ${orderData.userDetails.whatsapp}`, margin, margin + 65);
  
    // Table Borders
    const startTableY = margin + 80;
    doc.setDrawColor(0); // Black borders
    doc.rect(margin, startTableY, pageWidth - 2 * margin, 10); // Table header row
  
    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(...highlightColor);
    doc.setTextColor(255, 255, 255); // White text for header
    doc.rect(margin, startTableY, pageWidth - 2 * margin, 10, 'F'); // Header background
  
    const colItemX = margin + 5;
    const colQuantityX = pageWidth / 2 - 20; // Adjusted quantity column position
    const colTotalX = pageWidth - margin - 30;
  
    doc.text("Item", colItemX, startTableY + 7);
    doc.text("Quantity", colQuantityX, startTableY + 7);
    doc.text("Total", colTotalX, startTableY + 7);
  
    // Table Content
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryTextColor);
    let y = startTableY + 15;
  
    orderData.cartItems.forEach((item) => {
      // Row borders for each item
      doc.rect(margin, y - 5, pageWidth - 2 * margin, 10); // Row border
  
      // Column content
      doc.text(item.title, colItemX, y);
      doc.text(`${item.quantity}`, colQuantityX, y, { align: 'right' }); // Right-align quantity
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, colTotalX, y, { align: 'right' });
      y += 10;
    });
  
    // Total
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...highlightColor);
    doc.rect(margin, y - 5, pageWidth - 2 * margin, 10); // Total row border
    doc.text("Total", colItemX, y + 5);
    doc.text(`$${orderData.totalPrice}`, colTotalX, y + 5, { align: 'right' });
  
    // Footer Section
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryTextColor);
    doc.text(
      "Thank you for your purchase! If you have any questions, please contact us.",
      margin,
      pageHeight - margin - 5
    );
  
    // Save the PDF
    doc.save("invoice.pdf");
  };
  
  const sendWhatsAppMessage = (orderData) => {
    const message = `Hello ${orderData.userDetails.name},\n\nThank you for your order! Here are the details:\n\n` +
                    `Items:\n` +
                    `${orderData.cartItems.map(item => `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n` +
                    `Total Price: $${orderData.totalPrice}\n\n` +
                    `We will process your order shortly.`;
    
    const whatsappNumber = userDetails.whatsapp; // Get the WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp with the pre-filled message
    window.open(url, "_blank");
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
       
       
      
      <div className="container mx-auto px-4 py-10">
  <h2 className="text-4xl text-center font-semibold mb-10 text-black bg-gradient-to-b from-white to-blue-200 p-8 rounded-lg shadow-lg">Checkout</h2>
  <div className="flex flex-wrap -mx-4">
    <div className="w-full lg:w-1/2 px-4 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Shipping Information</h3>
        <form>
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Address Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your address"
              required
            />
          </div>

          {/* WhatsApp Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="whatsapp">
              WhatsApp Number
            </label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={userDetails.whatsapp}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your WhatsApp number"
              required
            />
          </div>

        
        </form>
      </div>
    </div>
 


          {/* Right side: Order Summary */}
          <div className="w-full lg:w-1/2 px-4">
  <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h3>
    <div className="divide-y divide-gray-200">
      {cartItems.map((item) => (
        <div key={item.id} className="flex justify-between py-4">
          <span className="text-gray-700 font-medium">
            {item.title} <span className="text-sm text-gray-500">x{item.quantity}</span>
          </span>
          <span className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
    <div className="mt-6 border-t border-gray-300 pt-4">
      <h4 className="text-xl font-semibold text-gray-800">
        Total Price: <span className="text-blue-600">${calculateTotalPrice()}</span>
      </h4>
    </div>
    <div className="text-center mt-8">
      <button
        onClick={handleCheckout}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
      >
        Place Order
      </button>
    </div>
  </div>
</div>

        </div>

        <Benefits />
        <Footer />
      </div>
    </>
  );
}

export default CheckoutPage;
