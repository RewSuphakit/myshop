import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdHistory } from "react-icons/md";

import axios from 'axios';
import Swal from 'sweetalert2';
const Header = () => {
  const { user, logout,countTotalItems,calculateTotalPrice,fetchCartInfo } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetchCartInfo();
  },[user?.user_id])
  const handleLogout = () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่",
      text: "คุณต้องการออกจากระบบ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"ยกเลิก",
      confirmButtonText: "ออกจากระบบ"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ออกจากระบบสำเร็จ!",
          text: "ขอคุณที่ใช่บริการ.",
          icon: "success"
        }).then(() => {
          logout(); // ทำการ logout หลังจากกดยืนยัน
        });
      }
    });
  };
  

  const finalNav = user?.user_id && (
    <>
      <li className=" text-xl font-bold  pb-2">
        <Link to="/Profile"><CgProfile />โปรฟาย</Link>
      </li>
      <li className=" text-xl font-bold  pb-2">
        <Link to="/Profile/OrderHistory"><MdHistory />ประวัตการสั่งซื้อ</Link>
      </li>
      <div className="divider"></div>
      <li className=" text-xl font-bold pb-2">
        <button  onClick={handleLogout}>
          <BiLogOut />  ออกจากระบบ
        </button>
      </li>
    </>
  );

  return (
    <div className="border ">
      <div className="navbar sticky top-0 z-50 container mx-auto rounded-lg">
        <div className="navbar-start ">
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ">
              <li>  <Link to="/">Home</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
              <li><Link to="/about">about</Link></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">{user?.user_id ? [user.first_name, ' ', user.last_name] : 'Guest'}</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 z-10">
            <li>  <Link to="/">Home</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/about">about</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end ">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="badge badge-sm indicator-item">{countTotalItems()}</span>
              </div>
            </div>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">{countTotalItems()} Items</span>
                <span className="text-info">Subtotal: ${calculateTotalPrice()}</span>
                <div className="card-actions">
              
                    <Link  className="btn btn-primary btn-block"
                      to={`/cart/${user?.user_id}`}
                      key={user?.user_id}
                    >
                      View cart
                    </Link>
                 
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            {user?.user_id && (
              <>
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src="https://www.011global.com/Account/Slices/user-anonymous.png" />
                  </div>
                </div>
                <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52 z-10">
                  {finalNav}
                </ul>
              </>
            )}
            {!user?.user_id && (
              <div className="flex">
                <div ><Link to="/login" className="btn btn-ghost">Login</Link></div>
                <div ><Link to="/register" className="btn btn-ghost">Register</Link></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
