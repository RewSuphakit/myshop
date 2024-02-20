import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!addresses || addresses.length === 0) {
       
    }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const cartData = {
        userId: user.user_id,
      };
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: cartData
      });
      setCartItems(res.data.cartItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  fetchCartItems();
}, []);

  const handleCheckout = async () => {
    try {
      const ordersData = {
        userId: user.user_id,
      };
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/checkout/checkout",
        ordersData,
        cartItems,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems([]);
      navigate("/checkout/cr");
    } catch (error) {
      console.error("Failed to place order:", error);
      setError("Failed to place order. Please try again later.");
    }
  };

 const handleAddressSelect = async () => {

 }

 const numberWithCommas = (number) => {
  return number.toLocaleString("en-US");
};
const calculateTotalPrice = () => {
  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
  });
  return totalPrice.toFixed(2);
};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="font-sans bg-white">
      <div className="max-lg:max-w-xl mx-auto w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 max-lg:order-1 p-6 max-w-4xl mx-auto w-full">
            <div className="text-center max-lg:hidden">
              <h2 className="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">Checkout</h2>
            </div>
            <form className="lg:mt-12">
  <div>
    <h2 className="text-2xl font-extrabold text-[#333]">Shipping info</h2>
    {/* เลือกที่อยู่ (ถ้ามีที่อยู่ในบัญชีของคุณแล้ว) */}
    <h3>เลือกที่อยู่ (ถ้ามี)</h3>
    {addresses.length > 0 ? (
      addresses.map((address) => (
        <div
          key={address.address_id}
          className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={() => handleAddressSelect(address)}
        >
          <h3 className="font-bold">{address.recipient_name}</h3>
          <p>{address.address_line1}</p>
          {address.address_line2 && <p>{address.address_line2}</p>}
          <p>
            {address.city}, {address.state}, {address.postal_code}
          </p>
        </div>
      ))
    ) : (
      <div className="grid grid-cols-2 gap-6 mt-8">
        <input
          type="text"
          placeholder="Name"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
        <input
          type="email"
          placeholder="Email address"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
        <input
          type="text"
          placeholder="Street address"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
        <input
          type="text"
          placeholder="City"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
        <input
          type="text"
          placeholder="State"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
        <input
          type="number"
          placeholder="Postal code"
          className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
        />
      </div>
    )}
  </div>
</form>

              <div className="mt-12">
                <h2 className="text-2xl font-extrabold text-[#333]">Payment method</h2>
                <div className="grid gap-4 sm:grid-cols-2 mt-8">
                  <div className="flex items-center">
                    <input type="radio" className="radio " name="radio-7" id="card" checked  />
                    <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                      <img src="https://readymadeui.com/images/visa.webp" className="w-12" alt="card1" />
                      <img src="https://readymadeui.com/images/american-express.webp" className="w-12" alt="card2" />
                      <img src="https://readymadeui.com/images/master.webp" className="w-12" alt="card3" />
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" className="radio " name="radio-7" id="paypal" />
                    <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                      <img src="https://readymadeui.com/images/paypal.webp" className="w-20" alt="paypalCard" />
                    </label>
                  </div>
                </div>
                <div className="grid gap-6 mt-8">
                  <input type="text" placeholder="Cardholder's Name"
                    className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  <div className="flex bg-white border-b-2 focus-within:border-[#333] overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 ml-3" viewBox="0 0 291.764 291.764">
                      <path fill="#2394bc" d="m119.259 100.23-14.643 91.122h23.405l14.634-91.122h-23.396zm70.598 37.118c-8.179-4.039-13.193-6.765-13.193-10.896.1-3.756 4.24-7.604 13.485-7.604 7.604-.191 13.193 1.596 17.433 3.374l2.124.948 3.182-19.065c-4.623-1.787-11.953-3.756-21.007-3.756-23.113 0-39.388 12.017-39.489 29.204-.191 12.683 11.652 19.721 20.515 23.943 9.054 4.331 12.136 7.139 12.136 10.987-.1 5.908-7.321 8.634-14.059 8.634-9.336 0-14.351-1.404-21.964-4.696l-3.082-1.404-3.273 19.813c5.498 2.444 15.609 4.595 26.104 4.705 24.563 0 40.546-11.835 40.747-30.152.08-10.048-6.165-17.744-19.659-24.035zm83.034-36.836h-18.108c-5.58 0-9.82 1.605-12.236 7.331l-34.766 83.509h24.563l6.765-18.08h27.481l3.51 18.153h21.664l-18.873-90.913zm-26.97 54.514c.474.046 9.428-29.514 9.428-29.514l7.13 29.514h-16.558zM85.059 100.23l-22.931 61.909-2.498-12.209c-4.24-14.087-17.533-29.395-32.368-36.999l20.998 78.33h24.764l36.799-91.021H85.059v-.01z" data-original="#2394bc" />
                      <path fill="#efc75e" d="M51.916 111.982c-1.787-6.948-7.486-11.634-15.226-11.734H.374L0 101.934c28.329 6.984 52.107 28.474 59.821 48.688l-7.905-38.64z" data-original="#efc75e" />
                    </svg>
                    <input type="number" placeholder="Card Number"
                      className="px-2 py-3.5 bg-white text-[#333] w-full text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="EXP."
                      className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                    <input type="number" placeholder="CVV"
                      className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  </div>
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-3 block text-sm">
                      I accept the <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline ml-1">Terms and Conditions</a>
                    </label>
                  </div>
                </div>
              </div>


              <div className="flex flex-wrap gap-4 mt-8">
                <button type="button" className="min-w-[150px] px-6 py-3.5 text-sm bg-gray-100 text-[#333] rounded-md hover:bg-gray-200">Back</button>
                <button type="button" className="min-w-[150px] px-6 py-3.5 text-sm bg-[#333] text-white rounded-md hover:bg-[#111]" onClick={handleCheckout}>Confirm payment ฿ {numberWithCommas(parseFloat(calculateTotalPrice()) + 50)}</button>
              </div>
          </div>
          <div className="bg-gray-100 lg:h-screen lg:sticky lg:top-0">
            <div className="relative h-full">
              <div className="p-8 lg:overflow-auto lg:h-[calc(100vh-60px)] max-lg:mb-8">
                <h2 className="text-2xl font-extrabold text-[#333]">Order Summary</h2>
                <div className="space-y-6 mt-10">

                {cartItems.map((item) => (
                  <div  key={item.cart_item_id} className="grid sm:grid-cols-2 items-start gap-6">
                    <div className="max-w-[190px] px-4 py-6 shrink-0 bg-gray-200 rounded-md">
                      <img  src={item.product.image} className="w-full object-contain" alt="product" />
                    </div>
                    <div>
                      <h3 className="text-base text-[#333]">{item.product.name}</h3>
                      <ul className="text-xs text-[#333] space-y-2 mt-2">
                        <li className="flex flex-wrap gap-4"> {item.product.description}</li>
                        <li className="flex flex-wrap gap-4">Quantity<span className="ml-auto">x{item.quantity} </span></li>
                        <li className="flex flex-wrap gap-4">Price <span className="ml-auto">฿ {item.product.price}</span></li>
                      </ul>
                    </div>
                  </div>
                 ))}
                </div>
              </div>
              <div className="absolute left-0 bottom-0 bg-gray-200 w-full p-4">
                <h4 className="flex flex-wrap gap-4 text-base text-[#333] font-bold">Total <span className="ml-auto">฿ {numberWithCommas(parseFloat(calculateTotalPrice()) + 50)}</span></h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
