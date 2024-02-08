import React from 'react';


const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
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
                className="object-cover w-full h-80 sm:h-96"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute inset-y-0 left-0 z-10 flex items-center justify-center w-12 h-12 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute inset-y-0 right-0 z-10 flex items-center justify-center w-12 h-12 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
