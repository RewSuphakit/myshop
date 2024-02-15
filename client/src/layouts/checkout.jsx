import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from '../hooks/useAuth';
const CheckOut = () => {
  const { user } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/payment/orders", {
            headers: { Authorization: `Bearer ${token}` }
          });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
        setError("Failed to fetch order data. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Check Out</h1>
      {orderData ? (
        <div>
          <h2>Order Summary</h2>
          <p>Order ID: {orderData.orderId}</p>
          <p>Total Amount: {orderData.totalAmount}</p>
          <p>Payment Method: {orderData.paymentMethod}</p>
          {/* แสดงข้อมูลอื่น ๆ ที่เกี่ยวข้องกับการสั่งซื้อ */}
        </div>
      ) : (
        <p>No order data available.</p>
      )}
    </div>
  );
};

export default CheckOut;
