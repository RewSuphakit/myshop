import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.cartItems);
        setLoading(false);
      } catch (error) {
        setError("Failed to load cart items. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchCartItems();
    }
  }, [id]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const updatedCartItems = cartItems.map((item) => {
        if (item.cart_item_id === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCartItems);

      await axios.put(
        `http://localhost:8000/api/cart/${cartItemId}`,
        {
          quantity: newQuantity
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError("Failed to update quantity. Please try again later.");
    }
  };
  const handleRemoveItem = async (productId, cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:8000/api/cart/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { cartItemId }
        }
      );
      if (res.status === 200) {
        // เรียก API เพื่ออัปเดตข้อมูลตะกร้า
        const newRes = await axios.get(`http://localhost:8000/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(newRes.data.cartItems);
      } else {
        console.error("Failed to remove item from cart:", res.data.error);
        setError("Failed to remove item from cart. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setError("Failed to remove item from cart. Please try again later.");
    }
  };
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });
    return totalPrice.toFixed(2);
  };

  const countTotalItems = () => {
    return cartItems.reduce(
      (total, currentItem) => total + currentItem.quantity,
      0
    );
  };

  const numberWithCommas = (number) => {
    return number.toLocaleString("en-US");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen pt-20">
      <h1 className="text-center text-2xl font-bold mb-8">
        Cart Items {countTotalItems()}
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center mt-8">Your cart is empty.</p>
      ) : (
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white rounded-lg p-6 shadow-md flex items-start"
                >
                  <img
                    src={item.product.image}
                    alt="product-image"
                    className="w-24 md:w-30 rounded-lg mr-6"
                  />
                  <div className="flex-grow flex justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {item.product.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item.product.description}
                      </p>
                    </div>
                    <div className="flex items-center flex-col mt-4">
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                          onClick={() => {
                            if (item.quantity > 1) {
                              handleQuantityChange(
                                item.cart_item_id,
                                item.quantity - 1
                              );
                            }
                          }}
                        >
                          -
                        </button>
                        <input
                          className="w-16 px-2 py-1 text-center text-sm text-gray-700"
                          type="text"
                          min="1"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                          onClick={() =>
                            handleQuantityChange(
                              item.cart_item_id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="ml-4 text-gray-800 mt-4">
                        Price: {numberWithCommas(item.product.price)} B
                      </p>
                    </div>
                  </div>
                  <button
                    className="ml-4 text-red-500"
                    onClick={() =>
                      handleRemoveItem(item.product.id, item.cart_item_id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex flex-col">
                <div className="flex justify-between mb-4">
                  <p className="text-gray-700">Subtotal</p>
                  <p className="text-gray-700">
                    {numberWithCommas(calculateTotalPrice())} B
                  </p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">50 B</p>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Total</p>
                  <div>
                    <p className="text-lg font-bold">
                      {numberWithCommas(parseFloat(calculateTotalPrice()) + 50)}{" "}
                      B
                    </p>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-blue-50 hover:bg-blue-600">
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
