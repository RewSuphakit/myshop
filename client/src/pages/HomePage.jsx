import Carousel from '../layouts/Carousel'
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import ProductNew from "../layouts/productNew";
import useAuth from '../hooks/useAuth';
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(
    () => {
      const fetchProducts = async () => {
        try {
          let url = `${apiUrl}/api/products/`;
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
          const res = await axios.get(`${apiUrl}/api/categories/`);
          setCategories(res.data);
        } catch (error) {
          console.error("Error fetching categories:", error); // Log the error
        }
      };
      fetchProducts();
      fetchCategories();
    },
    [selectedCategory]
  ); 

  const sliderRef = useRef();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
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
    <>
    <div className="container mx-auto">
    <Carousel/>
      <div className="flex justify-between mt-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">รายการสินค้า ใหม่</h1>
        </div>
        <div>
          <button className="rounded-full btn btn-ghost" onClick={goToPrev}>
            <IoMdArrowBack size={20} />
          </button>
          <button className="rounded-full btn btn-ghost " onClick={goToNext}>
            <IoMdArrowForward size={20} />
          </button>
        </div>
      </div>
      <div className="relative">
        {products.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {products.map((product) => (
              <Link
                to={`/Login`}
                key={product.product_id}
              >
                <div className=" bg-white p-4 m-2 max-w-xs shadow-md rounded-md">
                  
                  {product.image ? (
                  <>
                  <div className="relative">
                  <img
                      src={
                       product?.image
                          ? `${apiUrl}/${product.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : null
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                     <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs absolute top-1 left-1">New!</span>
                  </div>
                </>
                  ) : (
                    <div className="h-48 w-full bg-gray-200"></div>
                  )}
                  <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
                  <p className="mb-4 text-gray-600">{product.Category.name}</p>
                  <p className="text-gray-600">ราคา: {product.price} บาท</p>
                  {/* เพิ่ม Badge สินค้าใหม่ */}
                  {product.isRecent && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2">NEW</span>
                  )}
                </div>
              </Link>
            ))}
            
          </Slider>
        ) : (
          <p>ไม่มีข้อมูลสินค้า</p>
        )}
      </div>
    </div>
    <div className="container mx-auto py-8">
    <div className="flex justify-between items-center flex-wrap mb-4 mt-6">
        <h1 className="md:text-3xl font-bold sm:text-base sm:font-bold mb-2">
          รายการสินค้า ทั้งหมด
        </h1>
        <div className="flex w-full md:w-auto items-center md:ml-auto">
          <label htmlFor="category" className="mr-2">
            หมวดหมู่:
          </label>
          <select
            id="category"
            className="border rounded-md py-1 px-2 w-full md:w-auto md:mr-2"
            value={selectedCategory || ""}
            onChange={(e) => filterByCategory(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full md:w-auto items-center justify-center md:justify-end mt-2 md:mt-0">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="border rounded-md py-1 px-2 w-full md:w-auto"
          />
        </div>
      </div>
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {currentProducts
            .sort((a, b) => {
              if (a.stock_quantity === 0 && b.stock_quantity === 0) return 0;
              if (a.stock_quantity === 0) return 1;
              if (b.stock_quantity === 0) return -1;
              return 0;
            })
            .map((product) => (
              <Link
                to={
                  product.stock_quantity > 0
                    ? `/Login`
                    : "#"
                }
                key={product.product_id}
                className="hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="bg-white p-4 shadow-md rounded-md relative">
                  {product.stock_quantity > 0 ? (
                    product.image ? (
                      <img
                      src={
                       product?.image
                          ? `${apiUrl}/${product.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : null
                      }
                      alt={product.name}
                        className="w-full h-96 object-contain"
                      />
                    ) : (
                      <div className="h-32 w-full bg-gray-200"></div>
                    )
                  ) : (
                    <>
                      <img
                        src="https://www.shopch.in.th/wp-content/uploads/2021/10/soldout-badge2.png"
                        alt="สินค้าหมด"
                        className="w-full h-96 object-contain"
                      />
                      <span className="bg-red-500 text-white badge absolute top-2 right-2">
                        สินค้าหมด
                      </span>
                    </>
                  )}
                  <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
                  <p className="mb-2 text-gray-600">{product.Category.name}</p>
                  <p className="text-gray-600">ราคา: {product.price} บาท</p>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4   shadow-md rounded-md">
            <img
              src="https://www.shopch.in.th/wp-content/uploads/2021/10/soldout-badge2.png"
              alt="สินค้าหมด"
              className="w-full h-96 object-contain"
            />
            <h2 className="text-lg font-semibold mb-2">สินค้าหมดแล้ว</h2>
            <p className="text-gray-600">ไม่มีสินค้าที่แสดง</p>
          </div>
        </div>
      )}
      {currentProducts.length > 0 && (
        <ul className="flex justify-center mt-4">
          <li className="mr-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Previous
            </button>
          </li>
          {Array.from(
            { length: Math.ceil(products.length / productsPerPage) },
            (_, i) => i + 1
          ).map((number) => (
            <li key={number} className="mr-2">
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === number ? "bg-indigo-500" : "bg-indigo-500"
                } text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className="ml-2">
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(products.length / productsPerPage)
              }
              className="px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      )}
      </div>

    </>
  )
}
