import React from 'react';
import image from '../assets/pics/Frame.png';
import image1 from '../assets/pics/FrameM.jpg';
import image2 from '../assets/pics/Frame (1).png';
import image3 from '../assets/pics/Frame (2).png';
import image4 from '../assets/pics/Frame (3).png';
import image5 from '../assets/pics/Frame (4).png';
import image6 from '../assets/pics/Frame (5).png';

const categories = [
  { icon: image, label: 'Computer & Laptop' },
  { icon: image1, label: 'Mobile & Phone' },
  { icon: image2, label: 'Camera' },
  { icon: image3, label: 'TV & Smart Box' },
  { icon: image4, label: 'Home Appliance' },
  { icon: image5, label: 'Accessories' },
  { icon: image6, label: 'Other Categories' },
];

export default function HeroSection() {
  return (
    <section className="text-gray-600 body-font bg-gradient-to-b from-indigo-50 to-purple-50 py-12">
      {/* What We Provide Section */}
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          What <span className="text-purple-600">We</span> Provide
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Explore a wide range of products tailored to meet your needs.
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {categories.map((category, index) => (
            <div className="flex flex-col items-center" key={index}>
              <div
                className={`rounded-full p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  index % 2 === 0 ? 'bg-yellow-100' : 'bg-green-100'
                }`}
              >
                <img
                  src={category.icon}
                  alt={category.label}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="mt-4 text-gray-800 text-lg font-semibold">
                {category.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
