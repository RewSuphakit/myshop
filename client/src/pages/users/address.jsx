import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-toastify';
import axios from 'axios';
import EditAddress from '../users/editAddress';
import { MdDeleteOutline } from "react-icons/md";
const Address = () => {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [recipient_name, setRecipient_name] = useState('');
  const [address_line1, setAddress_line1] = useState('');
  const [address_line2, setAddress_line2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      let token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/address', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error('Error fetching address:', error.message);
    }
  };
  const handleAddAddress = () => {
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/address/add', {
        recipient_name: recipient_name,
        address_line1: address_line1,
        address_line2: address_line2,
        city: city,
        state: state,
        postal_code: postalCode,
        phone: phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 201) {
        setAddresses([res.data.address, ...addresses]);
        setRecipient_name('');
        setAddress_line1('');
        setAddress_line2('');
        setCity('');
        setState('');
        setPostalCode('');
        setPhone('');
        setShowModal(false);
        toast.success('Address added successfully!');
      } else {
        console.error("Error adding address: ", res.data.message);
        alert("Failed to add address. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding address: ", error); 
      alert("An error occurred. Please try again later.");
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDeleteAddress = async (id) => {
    try {
      let token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/address/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 204) {
        toast.success('Address deleted successfully!', {
          position: "top-center"
        });
        setAddresses(addresses.filter(address => address.address_id !== id));
      } else {
        console.error('Failed to delete address:', response.data);
        alert('Failed to delete address. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address. Please try again later.');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">เพิ่มที่อยู่</h2>
      <div className="overflow-x-auto">
  <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  lg:w-[100rem] gap-4">
    {addresses && addresses.map((address) => (
      <div key={address.address_id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg  ml-2 my-4 overflow-x-auto ">
        <div className="mb-4">
          <strong>ชื่อผู้รับ:</strong> {address.recipient_name}
        </div>
        <div className="mb-4">
          <strong>ที่อยู่ 1:</strong> {address.address_line1}
        </div>
        <div className="mb-4">
          <strong>ที่อยู่ 2:</strong> {address.address_line2}
        </div>
        <div className="mb-4">
          <strong>เมือง:</strong> {address.city}
        </div>
        <div className="mb-4">
          <strong>อำเภอ:</strong> {address.state}
        </div>
        <div className="mb-4">
          <strong>รหัสไปรษณีย์:</strong> {address.postal_code}
        </div>
        <div className="mb-4">
          <strong>เบอร์โทร:</strong> {address.phone}
        </div>
        <div className="flex justify-end">
        <button className="btn bg-red-200 hover:bg-red-400" onClick={() => handleDeleteAddress(address.address_id )}><MdDeleteOutline  size={20}/></button>
          <EditAddress addresses={address} fetchAddress={fetchAddress} />
        </div>
      </div>
    ))}
  </div>
</div>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <button className="btn btn-primary" onClick={handleAddAddress}>
              เพิ่มที่อยู่ +
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-16 sm:pb-4 ">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-0 right-0 p-4 cursor-pointer"
                >
                  <AiOutlineClose />
                </button>
                <form onSubmit={handleFormSubmit} className="w-96 p-4">
                  <h2 className="text-xl font-bold">กรอกที่อยู่</h2>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                   
            <div className="sm:col-span-3">
              <label htmlFor="recipient_name" className="block text-sm font-medium leading-6 text-gray-900">
                ชื่อผู้รับ
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="recipient_name"
                  id="recipient_name"
                  autoComplete="recipient_name"
                  value={recipient_name}
                  onChange={(e) => setRecipient_name(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                เบอร์โทร
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="phone"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="address_line1" className="block text-sm font-medium leading-6 text-gray-900">
              ที่อยู่1
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address_line1"
                  id="address_line1"
                  autoComplete="address_line1"
                  value={address_line1}
                  onChange={(e) => setAddress_line1(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="address_line2" className="block text-sm font-medium leading-6 text-gray-900">
              ที่อยู่2
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address_line2"
                  id="address_line2"
                  value={address_line2}
                  onChange={(e) => setAddress_line2(e.target.value)}
                  autoComplete="address_line2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="sm:col-span-2 ">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
              District
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  autoComplete="state"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="sm:col-span-2 ">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
              Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="city"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
            </div>

            <div className="sm:col-span-2 ">
              <label htmlFor="postal_code" className="block text-sm font-medium leading-6 text-gray-900">
                Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  autoComplete="postal_code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  p-4"
                />
              </div>
              </div>
              
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button type="submit" className="btn btn-primary">บันทึก</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
