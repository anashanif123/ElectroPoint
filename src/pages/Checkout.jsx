import React, { useEffect, useState } from "react";
import { db } from "../utils/utils.js"; // Import your Firebase config
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import { collection, query, where, getDocs, addDoc, writeBatch } from "firebase/firestore"; // Firestore functions
import jsPDF from "jspdf"; // Import jsPDF
import Footer from "../components/Footer.jsx";
import Benefits from "../components/Benefit.jsx";
import { message, Spin } from "antd";
import backgroundImage from "../assets/pics/Rectangle 1.jpg";
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
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Background Color
    doc.setFillColor(240, 240, 255); // Light blue background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128); // Dark blue title
    doc.text("Order Summary", pageWidth / 2, margin, { align: "center" });
  
    // User Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Name: ${orderData.userDetails.name}`, margin, margin + 10);
    doc.text(`Email: ${orderData.userDetails.email}`, margin, margin + 15);
    doc.text(`Address: ${orderData.userDetails.address}`, margin, margin + 20);
  
    // Items Header
    doc.text("Items:", margin, margin + 30);
    doc.setFont("helvetica", "bold");
    const itemsStartY = margin + 35;
  
    // Draw a line
    doc.setDrawColor(200);
    doc.line(margin, itemsStartY - 5, pageWidth - margin, itemsStartY - 5);
  
    // Item List
    let y = itemsStartY + 5; // Starting position for items
    doc.setFont("helvetica", "normal");
  
    orderData.cartItems.forEach((item) => {
      const itemDescription = `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
      doc.text(itemDescription, margin, y);
      y += 5;
    });
  
    // Draw a line for the total
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
  
    // Total Price
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0); // Green total
    doc.text(`Total Price: $${orderData.totalPrice}`, margin, y + 5);
  
    // Footer
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128); // Gray footer
    const footerText = "Thank you for your order!";
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - margin);
  
    // Save the PDF
    doc.save("order_summary.pdf");
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
      <div className="relative text-center">
        <div className="relative">
          <img
            className="w-full h-[50vh] object-cover object-center"
            src={backgroundImage}
            alt="Scandinavian interior mockup wall decal background"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
            <h1 className="text-4xl font-bold">Checkout</h1>
            <span className="text-lg mb-2">Home &gt; Checkout</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-4xl text-center font-semibold mb-4">Checkout</h2>
        <div className="flex flex-wrap -mx-4">
          {/* Left side: Shipping form */}
          <div className="w-full lg:w-1/2 px-4 mb-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700" htmlFor="whatsapp">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    id="whatsapp"
                    name="whatsapp"
                    value={userDetails.whatsapp}
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right side: Order Summary */}
          <div className="w-full lg:w-1/2 px-4">
            <div style={{ backgroundColor: "#f9f1e7" }} className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>
                    {item.title} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <h4 className="font-semibold">
                Total Price: ${calculateTotalPrice()}
              </h4>
              <div className="text-center mt-8">
                <button
                  onClick={handleCheckout}
                  className="text-black w-64 py-2 px-4 rounded-xl mt-4 transition-colors border border-black"
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
