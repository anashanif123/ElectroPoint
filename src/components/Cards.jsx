import React from "react";

import { Button } from "antd";
import {
  HeartOutlined,
  LikeOutlined,
  ShareAltOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const furnitureProducts = [
  {
    id: 1,
    name: "Syltherine",
    category: "Chair",
    price: "$16.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJZ_hSjDSN0noZD9a_s1S17699ZDXvNmrHtw&s",
  },
  {
    id: 2,
    name: "Leviosa",
    category: "Chair",
    price: "$21.15",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlW97lgX30XtChlIi7uePkOl2u38JZK80Rtg&s",
  },
  {
    id: 3,
    name: "Lolito",
    category: "Sofa",
    price: "$12.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZG8Ly0cYbt1whvZxCycIXCKDhi5vaazvrxw&s",
  },
  {
    id: 4,
    name: "Respira",
    category: "Desk",
    price: "$18.40",
    image: "https://cdn.mos.cms.futurecdn.net/YXb2Zyyxrfec4X5q3C2o7j.jpg",
  },

];

function Cards() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {furnitureProducts.map((product) => (
            <div
              key={product.id}
              className="lg:w-1/4 md:w-1/2 p-4 w-full group"
            >
              <div className="block relative h-60 rounded overflow-hidden">
                <img
                  alt="ecommerce"
                  className="object-cover object-center w-full h-full block"
                  src={product.image}
                />
                {/* Hover effect starts here */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center">
                    <Link to={"/shop"}
                      
                      className="bg-white px-4 py-2 font-bold mb-2 text-blue-600"
                    >
                      Go to shop
                    </Link >
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  {product.category}
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  {product.name}
                </h2>
                <p className="mt-1">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
        <Link to={"/Shop"}>
          <button
            // style={{ borderColor: "#b88e2f", color: "#b88e2f" }}
            className="m-auto mt-9 bg-white px-6 py-2 border w-60 font-bold border-blue-500 text-blue-600"
          >
            Show More
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cards;
