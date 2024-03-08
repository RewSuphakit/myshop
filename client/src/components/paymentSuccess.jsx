import React from 'react';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] text-center ">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-4 animate-jump animate-thrice animate-ease-in-out" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.522 4.477 10 10 10 5.522 0 10-4.478 10-10 0-5.523-4.478-10-10-10zm5 8.586l-6.05 6.05a.75.75 0 01-1.061 0L5 11.636l1.414-1.414 2.536 2.535L14.586 7l1.414 1.414z" clipRule="evenodd" />
        </svg>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Success</h2>
        <p className="text-lg text-gray-700 mb-4">Your payment has been successfully processed.</p>
        <p className="text-lg text-gray-700 mb-4">Thank you for your purchase!</p>
        <Link to="/MyShops/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
