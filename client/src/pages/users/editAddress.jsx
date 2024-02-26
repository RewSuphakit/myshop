// EditAddress.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaEdit } from "react-icons/fa";
import { toast } from 'react-toastify';

function EditAddress({ addresses, fetchAddress }) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const { id } = useParams();
  const { user } = useAuth(); 
  const [showModal, setShowModal] = useState(false);
  const [recipient_name, setRecipient_name] = useState('');
  const [address_line1, setAddress_line1] = useState('');
  const [address_line2, setAddress_line2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (addresses) {
      setRecipient_name(addresses.recipient_name || ''); 
      setAddress_line1(addresses.address_line1 || '');
      setAddress_line2(addresses.address_line2 || '');
      setCity(addresses.city || '');
      setState(addresses.state || '');
      setPostalCode(addresses.postal_code || '');
      setPhone(addresses.phone || '');
    }
  }, [addresses]);


  const handleSubmit = async () => {
    event.preventDefault();
    const token = localStorage.getItem('token'); 
    await axios.put(`${apiUrl}/address/update/${addresses.address_id}`, {
      recipient_name: recipient_name,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      postal_code: postalCode,
      phone: phone,
      userId:user.user_id
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowModal(false)
    toast.success('Address updated successfully!');
    fetchAddress();
  }

  return (
    <>
      <button className="btn ml-4 bg-yellow-100  hover:bg-yellow-300" onClick={() => setShowModal(true)}>
        <FaEdit size={15} />
      </button>
      {showModal && (
        <dialog id="my_modal_4" className="modal" open>
          <div className="modal-box w-11/12 max-w-5xl">
  
              <form method="dialog"className="p-4" onSubmit={handleSubmit}>
              <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Edit Address!</h3>
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
              <div className="relative h-20">
              <button type="submit " className="btn  absolute bottom-0 right-0  " >
                ตกลง
              </button>
              </div>
              </form>
          </div>
        </dialog>
      )}
    </>
  );
}

export default EditAddress;
