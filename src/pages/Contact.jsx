import React, { useState } from "react";
import { FaClock, FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import { db } from "../utils/utils"; // import the Firestore instance
import { collection, addDoc } from "firebase/firestore";
import backgroundImage from "../assets/pics/Rectangle 1.jpg";
import Footer from "../components/Footer";


const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contactData = { name, email, subject, message };

    try {
      const docRef = await addDoc(collection(db, "contacts"), contactData);
      console.log("Document written with ID: ", docRef.id);
      // Optionally, reset the form fields here
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
          <div className="relative text-center">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-black bg-gradient-to-b from-white to-blue-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mt-8">Contact</h1>
        <p className="text-lg text-gray-700 mb-8">

        </p>
       
    </div>
</div>
<br />
<br />
<br /> 
      <div>
        <h1 className="text-3xl font-bold text-center mb-4">Get In Touch With Us</h1>
        <p className="text-center mb-6">
          For more information about our product & services. Please feel free to
          drop us <br /> an email. Our staff always be there to help you out. Do
          not hesitate!
        </p>
      </div>
      <div className="flex justify-between p-8">
        <div className="w-1/2 pl-8">
          <div className="p-4 rounded">
            <h2 className="text-xl font-bold mb-2">
              <FaMapMarkedAlt className="mr-2" />
              Address
            </h2>
            <p className="mb-4">236 5th Avenue, New York, NY 10001</p>

            <h2 className="text-xl font-bold mb-2">
              <FaPhone className="mr-2" />
              Phone
            </h2>
            <p className="mb-4">Mobile: (84) 546-6789</p>

            <h2 className="text-xl font-bold mb-2">
              <FaClock /> Working Hours
            </h2>
            <p>Monday - Friday: 9am - 5pm</p>
            <p>Saturday: 10am - 2pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="w-1/2 pr-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Your name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1">
                Email address:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-1">
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-1">
                Message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer/>     
    </>
  );
};

export default Contact;
