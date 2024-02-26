import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Checkout = () => {
  const [recipient_name, setRecipient_name] = useState('');
  const [address_line1, setAddress_line1] = useState('');
  const [address_line2, setAddress_line2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [totalAmount,setTotalAmount] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = {
          userId: user.user_id
        };
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/api/cart`, {
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

  const handleSubmit = async () => {
    try {
    if (!recipient_name || !address_line1 || !city || !state || !postalCode || !phone) {
      toast.warn("กรอกข้อมูลที่อยู่ให้ครบ หรือ เลือกที่อยู่",{
        position:"top-center",
      });
      return; 
    }

      const newAddressData = {
        recipient_name,
        address_line1,
        address_line2,
        city,
        state,
        postal_code: postalCode,
        phone
      };
  
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/address/add`,
        newAddressData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.status === 201 && response.data.address && response.data.address.address_id) {
        const newAddressId = response.data.address.address_id;
        handleCheckout(newAddressId);
      } else {
        console.error("Failed to add address:", response.data.message);
        alert("Failed to add address. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      if (!selectedAddress) {
        await handleSubmit(); 
      } else {
        await handleCheckout(); 
      }
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      setError("Failed to confirm payment. Please try again later.");
    }
  };
  const handleCheckout = async (addressId) => {
    try {
      const ordersData = {
        userId: user.user_id,
        addressId: addressId || selectedAddress.address_id
      };
  
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${apiUrl}/checkout/checkout`,
        { ...ordersData, cartItems, paymentMethod, totalAmount },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCartItems([]);
      toast.success('ชำระเงินนสำเร็จ')
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error("Failed to place order:", error);
      setError("Failed to place order. Please try again later.");
    }
  };
  

  const numberWithCommas = (number) => {
    return number.toLocaleString("en-US");
  };
  const calculateTotalPrice = () => {
    let totalPrice = 50;
    cartItems.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });
    return totalPrice.toFixed(2); 
  };

  useEffect(() => {
    setTotalAmount(calculateTotalPrice());
  }, [cartItems]);

  const handleChange = () => {
    setPaymentMethod(event.target.value);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!addresses || addresses.length === 0) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${apiUrl}/address`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAddresses(res.data.addresses);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const handleGoBack = () => {
    navigate(-1); 
  };
  return (
    <>
      <div className="font-sans bg-white">
        <div className="max-lg:max-w-xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 max-lg:order-1 p-6 max-w-4xl mx-auto w-full">
              <div className="text-center max-lg:hidden">
                <h2 className="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">
                  Checkout
                </h2>
              </div>
              <div>
      <form onSubmit={handleSubmit} className="lg:mt-12">
        <div>
          <h2 className="text-2xl font-extrabold text-[#333]">Shipping info</h2>
          <h3>เลือกที่อยู่ (กรณีที่เพิ่มที่อยู่ใน Profile)</h3>
          {loading ? (
            <p>Loading...</p>
          ) : addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.address_id}
                className={`border p-4 rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedAddress === address ? "border-green-500 " : "border-gray-300"
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{address.recipient_name}</h3>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state}, {address.postal_code}
                    </p>
                  </div>
                  {selectedAddress === address && <span className="text-green-500  badge-lg">✓</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-2 gap-6 mt-8">
              <input
                type="text"
                name="recipient_name"
                id="recipient_name"
                autoComplete="recipient_name"
                placeholder="Name"
                value={recipient_name}
                onChange={(e) => setRecipient_name(e.target.value)}
                required
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
              <input
                type="text"
                name="phone"
                id="phone"
                autoComplete="phone"
                placeholder="Phone"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
              <input
                type="text"
                name="address_line1"
                id="address_line1"
                autoComplete="address_line1"
                placeholder="Address Line 1"
                value={address_line1}
                onChange={(e) => setAddress_line1(e.target.value)}
                required
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
              <input
                type="text"
                name="city"
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="city"
                required
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
              <input
                type="text"
                name="state"
                id="state"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                autoComplete="state"
                required
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder="Postal Code"
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)} 
                autoComplete="postalCode"
                className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
              />
            </div>
          )}
          <div className="mt-6">
           
          </div>
        </div>
      </form>
    </div>

              <div className="mt-12">
                <h2 className="text-2xl font-extrabold text-[#333]">
                  Payment method
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 mt-8">
                  <div className="flex items-center">
                  <input
                      type="radio"
                      className="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={paymentMethod === 'card'} // Check if 'card' payment method is selected
                      onChange={handleChange}
                    />
                    <label
                      className="ml-4 flex gap-2 cursor-pointer"
                    >
                      <img
                        src="https://readymadeui.com/images/visa.webp"
                        className="w-12"
                        alt="card1"
                      />
                      <img
                        src="https://readymadeui.com/images/american-express.webp"
                        className="w-12"
                        alt="card2"
                      />
                      <img
                        src="https://readymadeui.com/images/master.webp"
                        className="w-12"
                        alt="card3"
                      />
                    </label>
                  </div>
                  <div className="flex items-center">
                  <input
                      type="radio"
                      className="radio "
                      name="paymentMethod"
                      id="paypal"
                      value="paypal"
                      checked={paymentMethod === 'paypal'} // Check if 'paypal' payment method is selected
                      onChange={handleChange}
                    />
                    <label
                      className="ml-4 flex gap-2 cursor-pointer"
                    >
                      <img
                        src="https://readymadeui.com/images/paypal.webp"
                        className="w-20"
                        alt="paypalCard"
                      />
                    </label>
                  </div>
                </div>
               
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
              <button
      type="button"
      className="min-w-[150px] px-6 py-3.5 text-sm bg-gray-100 text-[#333] rounded-md hover:bg-gray-200"
      onClick={handleGoBack} // เรียกใช้งาน handleGoBack เมื่อปุ่มถูกคลิก
    >
      Back
    </button>
                <button
                  type="button"
                  className="min-w-[150px] px-6 py-3.5 text-sm bg-[#333] text-white rounded-md hover:bg-[#111]"
                  onClick={handleConfirmPayment}
                > 
                  Confirm payment ฿{" "}
                  {numberWithCommas(parseFloat(calculateTotalPrice()))}
                </button>
              </div>
            </div>
            <div className="bg-gray-100 lg:h-screen lg:sticky lg:top-0">
              <div className="relative h-full">
                <div className="p-8 lg:overflow-auto lg:h-[calc(100vh-60px)] max-lg:mb-8">
                  <h2 className="text-2xl font-extrabold text-[#333]">
                    Order Summary
                  </h2>
                  <div className="space-y-6 mt-10">
                    {cartItems.map((item) => (
                      <div
                        key={item.cart_item_id}
                        className="grid sm:grid-cols-2 items-start gap-6"
                      >
                        <div className="max-w-[190px] px-4 py-6 shrink-0 bg-gray-200 rounded-md">
                        <img
                      src={
                       item.product?.image
                          ? `${apiUrl}/${item.product.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : null
                      }
                      alt={item.product.name}
                            className="w-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-base text-[#333]">
                            {item.product.name}
                          </h3>
                          <ul className="text-xs text-[#333] space-y-2 mt-2">
                            <li className="flex flex-wrap gap-4">
                              {" "}
                              {item.product.description}
                            </li>
                            <li className="flex flex-wrap gap-4">
                              Quantity
                              <span className="ml-auto">x{item.quantity} </span>
                            </li>
                            <li className="flex flex-wrap gap-4">
                              Price{" "}
                              <span className="ml-auto">
                                ฿ {item.product.price}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute left-0 bottom-0 bg-gray-200 w-full p-4">
                  <h4 className="flex flex-wrap gap-4 text-base text-[#333] font-bold">
                    Total{" "}
                    <span className="ml-auto">
                      ฿{" "}
                      {numberWithCommas(parseFloat(calculateTotalPrice()))}
                    </span>
                  </h4>
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