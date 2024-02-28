import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaUserEdit } from "react-icons/fa";
function EditProfile() {
  const { id } = useParams();
  const { user,run } = useAuth(); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [profileData,setProfileData] = useState();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      await axios.put(
        `${apiUrl}/auth/profile/${user.user_id}`,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowModal(false);
      toast.success('Profile updated successfully!', { position: "top-center" });
      run();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile', { position: "top-center" });
    }
  };
  return (
    <>
    
      <button className="btn" onClick={() => setShowModal(true)}>
      <FaUserEdit  size={20}/>
      </button>
      {showModal && (
        <dialog id="my_modal_3" className="modal" open>
          <div className="modal-box ">
            <form onSubmit={handleSubmit}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Edit Profile!</h3>
              <label className="input input-bordered flex items-center gap-2 mt-4">
ชื่อ
              <input
                type="text"
                placeholder="FirstName"
                className=" mr-2  p-2 text-sm w-full "
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
   </label>
   <label className="input input-bordered flex items-center gap-2 mt-4">
 นามสกุล
              <input
                type="text"
                placeholder="LastName "
                className=" max-w-xs mb-4 mt-4 text-sm " 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
                 </label>
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

export default EditProfile;
