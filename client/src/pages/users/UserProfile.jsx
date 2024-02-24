import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import  Address  from './address'
import  EditProfile from './editProfile';
import { FaAddressBook } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
<div className="flex justify-center  mt-10  h-screen">
  <div className="w-full max-w-7xl px-4">
    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
      <div className="w-full lg:w-1/3">
        <div className="flex flex-col gap-2 justify-end"> 
          <button className={`btn ${activeTab === 'personal' && 'btn-primary'}`} onClick={() => handleTabClick('personal')}><ImProfile />ข้อมูลส่วนตัว</button>
          <button className={`btn ${activeTab === 'address' && 'btn-primary'}`} onClick={() => handleTabClick('address')}><FaAddressBook />ที่อยู่</button>
          <button className={`btn ${activeTab === 'orderStatus' && 'btn-primary'}`} onClick={() => handleTabClick('orderStatus')}>Order Status</button>
          <button className={`btn ${activeTab === 'orderHistory' && 'btn-primary'}`} onClick={() => handleTabClick('orderHistory')}>Order History</button>
        </div>
      </div>

      <div className="w-full lg:w-2/3">
        <div className="p-4 bg-white rounded-lg shadow-md">
          {activeTab === 'personal' && user && (
            <>
            <div className="relative ">
               <div className="absolute top-0 right-0 ">   
                 <EditProfile />
               </div>
               </div>
             <div className="">
             <h2 className="text-xl font-bold mb-4 ">ข้อมูลส่วนตัว</h2>
            <p className="mb-2 "><strong>ชื่อ:</strong> {user.first_name}</p>
            <p className="mb-2 "> <strong>นามสกุล:</strong>{user.last_name}</p>
            <p className="mb-2"><strong>อีเมล์:</strong> {user.email}</p>
            </div>
        
          </>
          )}
          {activeTab === 'address' &&  (
           <div className="">
            <Address />
            </div>
          )}
          {activeTab === 'orderStatus' && (
            <div>
              {/* แสดงข้อมูลสถานะการสั่งซื้อตามที่ต้องการ */}
            </div>
          )}
          {activeTab === 'orderHistory' && (
            <div>
              {/* แสดงข้อมูลประวัติการสั่งซื้อตามที่ต้องการ */}
            </div>
          )}
          
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default UserProfile;
