import BackgroundImage from "../components/MainBackground";
import HeroSection from "../components/Hero";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-center py-10 bg-blue-50">
        <BackgroundImage />
      </div>

      {/* Categories Section */}
      <HeroSection />
      {/* Products Section */}
      <div className="product-section text-center py-10 ">
        <h2 className="font-bold text-5xl text-blue-600 mb-6">Our Products</h2>
       
      </div>
<Cards/>

      {/* Hashtag Section */}
      <div className="hashtag-section text-center py-10">
        <p className="text-lg text-gray-600">Share Your Setup with</p>
        <h1 className="font-bold text-4xl text-blue-700 mb-5">#Electro Point</h1>
        {/* <Gallery /> */}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
