import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Reviews from '../layouts/reviews';

const ProductDetails = ({ userId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1); // จำนวนสินค้า
    const { id } = useParams();
    const { user,fetchCartInfo } = useAuth();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                let token = localStorage.getItem('token');
                const res = await axios.get(`${apiUrl}/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProduct(res.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if (quantity > product.stock_quantity) {
                toast.error('ไม่สามารถเพิ่มมากกว่าสต็อกที่มีอยู่ กรุณาปรับปริมาณ');
                return;
            }
            const cartData = {
                userId: user.user_id,
                productId: product.product_id,
                quantity: quantity,
            };

            let token = localStorage.getItem('token');
            const response = await axios.post(`${apiUrl}/api/cart`, cartData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', 
                },
            });
            fetchCartInfo();
            if (response.status === 200) {
                toast.success('เพิ่มสินค้าไปยังตะกร้าสินค้าแล้ว!',{
                    position: "top-center"
                });
            } else {
                console.error('Failed to add product to cart:', response.data);
                alert('Failed to add product to cart. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart. Please try again later.');
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(quantity + 1);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Product Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product ? (
                <div>
                    <div className="bg-white p-4 shadow-md rounded-md flex">
                        <div className="w-full md:w-1/3 mr-4">
                        <img
                      src={
                       product?.image
                          ? `${apiUrl}/uploads/${product.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : null
                      }
                      alt={product.name}
                            className="w-full h-auto object-cover rounded-md box-content border-2" />
                        </div>
                        <div className="w-full md:w-2/3">
                            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                            <p className="mb-4 text-gray-600">{product.description}</p>
                            <p className="text-gray-600">ราคา: {product.price} บาท</p>
                            <p className="text-gray-600">จำนวนสินค้า: {product.stock_quantity}</p>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button onClick={decreaseQuantity} className="px-3 py-1 border-r border-gray-300">-</button>
                                    <input type="number" id="quantity" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-16 h-8 text-center" />
                                    <button onClick={increaseQuantity} className="px-3 py-1 border-l border-gray-300">+</button>
                                </div>
                            </div>
                            <button className="btn btn-primary ml-2" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No product found.</p>
            )}
            {/* แสดง Card ของ Review */}
            <div className="bg-white p-4 shadow-md rounded-md ">
                <Reviews />
            </div>
        </div>
    </div>
    );
};

export default ProductDetails;
