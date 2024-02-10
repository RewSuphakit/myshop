import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';

const ProductNew = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/products/?sort=desc')
                setProducts(res.data);  // รับข้อมูลทั้งหมดที่ส่งกลับมาจาก API
            } catch (error) {
                console.error('Error fetching fetchProducts:', error.message);
            }
        };
        fetchProducts();
    }, []);

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

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-4">รายการสินค้า ใหม่</h1>
                </div>
                <div>
                    <button className="rounded-full btn btn-ghost" onClick={goToPrev}><IoMdArrowBack size={20} /></button>
                    <button className="rounded-full btn btn-ghost " onClick={goToNext}><IoMdArrowForward size={20} /></button>
                </div>
            </div>
            <div className="relative">
                {products.length > 0 ? (
                    <Slider ref={sliderRef} {...settings}>
                      {products.slice(0, 6).map(product => (
    <Link to={`/ProductDetails/${product.product_id}`} key={product.product_id}>
        <div className="bg-white p-4 m-4 shadow-md rounded-md">
            <img src={`../images/${product.image}`} alt="product" />
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="mb-4 text-gray-600">{product.Category.name}</p>
            <p className="text-gray-600">ราคา: {product.price} บาท</p>
        </div>
    </Link>
))}
                    </Slider>
                ) : (
                    <p>ไม่มีข้อมูลสินค้า</p>
                )}
            </div>
        </>
    );
};

export default ProductNew;
