import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import  useAuth from '../hooks/useAuth'

const ProductDetails = ({ userId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const { user } = useAuth();
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                let token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:8000/api/products/${id}`, {
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
            if (!user.user_id || !product.product_id) {
                console.error('User ID or Product ID is missing.');
                alert('User ID or Product ID is missing. Please try again later.');
                return;
            }
    
            const cartData = {
                userId: user.user_id,
                productId: product.product_id,
                quantity: quantity
            };
    
            let token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/cart', cartData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // ระบุ Content-Type เป็น JSON
                }
            });
    
            // ตรวจสอบว่าเพิ่มสินค้าเข้าตะกร้าสำเร็จหรือไม่
            if (response.status === 200) {
                alert('Product added to cart!');
            } else {
                console.error('Failed to add product to cart:', response.data);
                alert('Failed to add product to cart. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart. Please try again later.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Product Details</h1>
            {product ? (
                <div className="bg-white p-4 shadow-md rounded-md">
                    <img src={`../images/${product.image}`} alt="product" />
                    <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                    <p className="mb-4 text-gray-600">{product.description}</p>
                    <p className="text-gray-600">Price: {product.price} บาท</p>
                    <p className="text-gray-600">Stock Quantity: {product.stock_quantity}</p>
                    <label htmlFor="quantity" className="text-gray-600">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-16 h-8 border-gray-300 rounded-md"
                    />
                    <button className="btn btn-primary ml-2" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            ) : (
                <p>No product found.</p>
            )}
        </div>
    );
};

export default ProductDetails;
