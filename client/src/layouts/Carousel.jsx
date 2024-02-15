import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState(null);
  const products = [
    { 
      name: 'Product 1',
      image: 'https://media-cdn.bnn.in.th/374811/iphone15pro-1752x640-070224_290224-category_banner_medium.jpg'
    },
    { 
      name: 'Product 2',
      image: 'https://setting.ihavecpu.com/uploads/category/shop1/category_banner_107.jpeg?1705235479'
    },
    { 
      name: 'Product 3',
      image: 'https://www.flashfly.net/wp/wp-content/uploads/2017/06/unnamed.png'
    },
    { 
      name: 'Product 4',
      image: 'https://investor.bigcamera.co.th/media/wysiwyg/news/2023/big-camera-festival/big-camera-festival-2023-banner1.jpg'
    },
    { 
      name: 'Product 5',
      image: 'https://www.mobileocta.com/wp-content/uploads/2022/03/Line-Ads_1200x628-cv.jpg'
    },
  ];

  const nextSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const startAutoplay = () => {
    setAutoplayInterval(setInterval(() => {
      nextSlide();
    }, 15000)); 
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  const handleMouseEnter = () => {
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, []); 

  return (
    <div className="relative mt-10" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="overflow-hidden relative">
        <div className="flex justify-center w-full">
          {products.map((product, index) => (
            <div
              key={index}
              className={`${
                index === currentIndex ? 'block' : 'hidden'
              } w-full transition-all duration-500 ease-in-out`}
            >
              <img
                src={product.image}
                alt={product.name}
                className=" bg-contain bg-center bg-no-repeat w-full h-80 sm:h-96"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 mx-1 rounded-full focus:outline-none ${index === currentIndex ? 'bg-indigo-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute inset-y-0 left-0 z-10 flex items-center justify-center w-12 h-12 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute inset-y-0 right-0 z-10 flex items-center justify-center w-12 h-12 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
