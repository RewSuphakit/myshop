import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-toastify';
import axios from 'axios';
import EditAddress from '../users/editAddress';
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
    fetchAddress();
  }, []);

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
      console.error("Error adding address: ", error); // Log the full error object for better debugging
      alert("An error occurred. Please try again later.");
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">เพิ่มที่อยู่</h2>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2">ชื่อผู้รับ</th>
              <th className="p-2">ที่อยู่ 1</th>
              <th className="p-2">ที่อยู่ 2</th>
              <th className="p-2">เมือง</th>
              <th className="p-2">อำเภอ</th>
              <th className="p-2">รหัสไปรษณีย์</th>
              <th className="p-2">เบอร์โทร</th>
              <th className="p-2">EDIT</th>
            </tr>
          </thead>
          <tbody>
            {addresses && addresses.map((address) => (
              <tr key={address.address_id} className="hover:bg-gray-100">
                <td className="p-2" style={{ minWidth: '150px' }}>{address.recipient_name}</td>
                <td className="p-2" style={{ minWidth: '150px' }}>{address.address_line1}</td>
                <td className="p-2" style={{ minWidth: '150px' }}>{address.address_line2}</td>
                <td className="p-2" style={{ minWidth: '100px' }}>{address.city}</td>
                <td className="p-2" style={{ minWidth: '100px' }}>{address.state}</td>
                <td className="p-2" style={{ minWidth: '100px' }}>{address.postal_code}</td>
                <td className="p-2" style={{ minWidth: '150px' }}>{address.phone}</td>
                <td className="p-2"><EditAddress/></td>
              </tr>
            ))}
          </tbody>
        </table>
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
