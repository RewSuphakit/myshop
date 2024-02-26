import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const ProductNew = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/products/?sort=desc`
        );
        const filteredProducts = res.data.filter(product => product.stock_quantity > 0);
        const productsWithRecentBadge = filteredProducts.map(product => ({
          ...product,
          isRecent: 
            new Date(product.created_at) > new Date(new Date().setDate(new Date().getDate() - 7)) 
        }));
        setProducts(productsWithRecentBadge);
      } catch (error) {
        console.error("Error fetching fetchProducts:", error.message);
      }
    };
    fetchProducts();
  }, []);

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

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4 ">รายการสินค้า ใหม่</h1>
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
                to={`/ProductDetails/${product.product_id}`}
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
  );
};

export default ProductNew;
