import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import ProductNew from "./productNew";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(
    () => {
      const fetchProducts = async () => {
        try {
          let url = "http://localhost:8000/api/products/";
          if (selectedCategory) {
            url += `?category=${selectedCategory}`;
          }
          const res = await axios.get(url);
          setProducts(res.data);
        } catch (error) {
          console.error("Error fetching products:", error); // Log the error
        }
      };

      const fetchCategories = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/categories/");
          setCategories(res.data);
        } catch (error) {
          console.error("Error fetching categories:", error); // Log the error
        }
      };

      fetchProducts();
      fetchCategories();
    },
    [selectedCategory]
  ); // Add selectedCategory to dependencies array

  const sliderRef = useRef();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const filterByCategory = categoryId => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <ProductNew />
      <div className="flex justify-between items-center mb-4 mt-6">
        <h1 className="md:text-3xl font-bold sm:text-base sm:font-bold ">
          รายการสินค้า ทั้งหมด
        </h1>
        <div className="flex items-center">
          <label htmlFor="category" className="mr-2">
            หมวดหมู่:
          </label>
          <select
            id="category"
            className="border rounded-md py-1 px-2"
            value={selectedCategory || ""}
            onChange={e => filterByCategory(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {categories.map(category =>
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            )}
          </select>
        </div>
      </div>
      {currentProducts.length > 0
        ? <div className="grid grid-cols-6 gap-4">
            {currentProducts.map(product =>
              <Link
                to={`/ProductDetails/${product.product_id}`}
                key={product.product_id}
             
              >
                <div className="bg-white p-4   shadow-md rounded-md">
                {product.image ? ( // เช็คว่ามีรูปภาพหรือไม่
                            <img src={product.image} alt={product.name} className="w-full h-96 object-contain"/>
                        ) : (
                            <div className="h-32 w-full bg-gray-200"></div> // ถ้าไม่มีรูปภาพ
                        )}
                  <h2 className="text-lg font-semibold mb-2">
                    {product.name}
                  </h2>
                  <p className="mb-2 text-gray-600">
                    {product.Category.name}
                  </p>
                  <p className="text-gray-600">
                    ราคา: {product.price} บาท
                  </p>
                </div>
              </Link>
            )}
          </div>
        : <p>ไม่มีข้อมูลสินค้า</p>}
      <ul className="flex justify-center mt-4">
        <li className="mr-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Previous
          </button>
        </li>
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, i) => i + 1
        ).map(number =>
          <li key={number} className="mr-2">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-lg ${currentPage === number
                ? "bg-blue-600"
                : "bg-blue-500"} text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
            >
              {number}
            </button>
          </li>
        )}
        <li className="ml-2">
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(products.length / productsPerPage)
            }
            className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Product;
