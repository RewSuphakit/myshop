import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

function EditProfile() {
  const { id } = useParams();
  const { user } = useAuth(); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [profileData,setProfileData] = useState();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get("http://localhost:8000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error fetching profile data', { position: "top-center" });
      }
    };
    fetchProfile();
  }, [user.updated_at]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      await axios.put(
        `http://localhost:8000/auth/profile/${user.user_id}`,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Profile updated successfully!', { position: "top-center" });
      setShowModal(false);
    } catch (error) {
      // Handle error, perhaps show a toast message
      console.error('Error updating profile:', error);
      toast.error('Error updating profile', { position: "top-center" });
    }
  };

  return (
    <div>
      <button className="btn" onClick={() => setShowModal(true)}>
        Edit
      </button>
      {showModal && (
        <dialog id="my_modal_3" className="modal" open>
          <div className="modal-box">
            <form onSubmit={handleSubmit}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Edit Profile!</h3>
              <input
                type="text"
                placeholder="FirstName"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="LastName"
                className="input mt-4"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <button type="submit" className="btn">
                ตกลง
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default EditProfile;
