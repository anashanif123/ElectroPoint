import React from 'react';
import image from '../assets/pics/Frame.png';
import image1 from '../assets/pics/FrameM.jpg';
import image2 from '../assets/pics/Frame (1).png';
import image3 from '../assets/pics/Frame (2).png';
import image4 from '../assets/pics/Frame (3).png';
import image5 from '../assets/pics/Frame (4).png';
import image6 from '../assets/pics/Frame (5).png';
const categories = [
  { icon:image , label: 'Computer & Laptop' },
  { icon: image1, label: 'Mobile & Phone' },
  { icon:image2, label: 'Camera' },
  { icon:image3, label: 'TV & Smart Box' },
  { icon: image4, label: 'Home Appliance' },
  { icon: image5, label: 'Accessories' },
  { icon: image6, label: 'Other Categories' },
];
export default function HeroSection() {
  return (
    <section className="text-gray-600 body-font bg-blue-50">
      {/* What We Provide Section */}
      <div className="text-center my-12">
      <h2 className="text-3xl font-bold">
        What <span className="text-blue-600">we</span> provide?
      </h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {categories.map((category, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className="bg-gray-100 rounded-full p-5">
              <img src={category.icon} alt={category.label} className="w-16 h-16" />
            </div>
            <p className="mt-4 text-gray-700 text-sm">{category.label}</p>
          </div>
        ))}
      </div>
    </div>

      
    </section>
  );
}
