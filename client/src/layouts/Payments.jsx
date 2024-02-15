import React, { useState } from "react";
import axios from "axios";

const Payments = ({ cartItems, calculateTotalPrice, handleCheckout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Perform payment processing logic here
      // For demonstration purpose, let's assume a successful payment
      await axios.post("http://localhost:8000/api/payment", {
        // Provide necessary payment information here
        // Example: items: cartItems, totalPrice: calculateTotalPrice()
      });
      handleCheckout(); // Call handleCheckout when payment is successful
    } catch (error) {
      setError("Payment failed. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-blue-50 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Check out"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Payments;
