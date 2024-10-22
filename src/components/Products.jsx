import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Productvip component
function Productvip() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to display per page

  // Fetch data from the dummy JSON API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.in/api/products");
        const data = await response.json();
        console.log("Fetched data:", data);

        // Check if the data has a 'products' property and it's an array
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products); // Set products from the 'products' array in the response
        } else {
          console.error("Fetched data does not contain a valid products array:", data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading indicator while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  // Handle case where products is not an array
  if (!Array.isArray(products)) {
    return <div>Error: Products data is not valid.</div>;
  }

  // Function to truncate the description
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on sort criteria
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortCriteria === "price-asc") return a.price - b.price;
    if (sortCriteria === "price-desc") return b.price - a.price;
    return 0; // default case, no sorting
  });

  // Calculate paginated products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Featured Products
      </h1>

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Sort Filter */}
      <div className="flex justify-between my-4">
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {currentProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id} // Use product.id as the key
            className="border p-5 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-56 object-cover rounded-md mb-5"
            />
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              {product.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {truncateText(product.description, 10)}
            </p>
            <p className="text-red-500 font-bold text-lg mb-2">
              ${product.price}
            </p>
            {product.rating && (
              <p className="text-yellow-500 font-medium">
                ⭐ {product.rating.rate} / 5
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center my-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-2 p-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="mx-2 p-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Productvip;
