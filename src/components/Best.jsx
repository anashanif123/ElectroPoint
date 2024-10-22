import React from "react";

function Best() {
  // Array of product objects
  const products = [
    {
      title: "1 sectional sofa",
      model: "TFCBLIGRBL6SRHS",
      material: "Solid Wood",
      configuration: "L-shaped",
      upholsteryMaterial: "Fabric + Cotton",
      color: "Bright Grey & Lion",
      warranty: "1 Year Warranty",
    },
    {
      title: "1 Three Seater, 2 Single Seater",
      model: "DTUBLIGRBL568",
      material: "Solid Wood",
      configuration: "L-shaped",
      upholsteryMaterial: "Fabric + Cotton",
      color: "Bright Grey & Lion",
      warranty: "2 Years Warranty",
    },
    {
      title: "1 sectional sofa",
      model: "TFCBLIGRBL6SRHS",
      material: "Solid Wood",
      configuration: "L-shaped",
      upholsteryMaterial: "Fabric + Cotton",
      color: "Bright Grey & Lion",
      warranty: "1 Year Warranty",
    },
    {
      title: "1 Three Seater, 2 Single Seater",
      model: "DTUBLIGRBL568",
      material: "Solid Wood",
      configuration: "L-shaped",
      upholsteryMaterial: "Fabric + Cotton",
      color: "Bright Grey & Lion",
      warranty: "2 Years Warranty",
    },
  ];

  // Titles for the attributes
  const attributeTitles = [
    "Sales Package",
    "Model Number",
    "Secondary Material",
    "Configuration",
    "Upholstery Material",
    "Upholstery Color",
    "Warranty",
  ];

  return (
    <div className="container mx-auto px-5 py-10">
      <h2 className="text-2xl font-semibold mb-6">General</h2>

      {/* Table structure */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-4">
        {/* Left column: attribute titles */}
        <div>
          {attributeTitles.map((title, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
              <p className="text-lg font-bold">{title}</p>
            </div>
          ))}
        </div>

        {/* Middle and Right columns: product details */}
        {products.slice(0, 2).map((product, index) => (
          <div key={index} className="sm:col-span-1">
            <div className="border-b border-gray-300 py-4">
              <p>{product.title}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.model}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.material}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.configuration}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.upholsteryMaterial}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.color}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.warranty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional section for the remaining products */}
      <h2 className="text-2xl font-semibold mt-10 mb-6">Product Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-4">
        {/* Left column: attribute titles */}
        <div>
          {attributeTitles.map((title, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
              <p className="text-lg font-bold">{title}</p>
            </div>
          ))}
        </div>

        {/* Middle and Right columns: product details */}
        {products.slice(2).map((product, index) => (
          <div key={index} className="sm:col-span-1">
            <div className="border-b border-gray-300 py-4">
              <p>{product.title}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.model}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.material}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.configuration}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.upholsteryMaterial}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.color}</p>
            </div>
            <div className="border-b border-gray-300 py-4">
              <p>{product.warranty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Best;