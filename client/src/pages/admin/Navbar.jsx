import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
          navigate('/'); // ทำการ redirect ไปยังหน้าหลักหลังจาก logout
        });
      }
    });
  };
  return (
    <div>
    <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      <li><Link to="Dashboard">Dashboard</Link></li>
        <li><Link to="/AddProductForm">Product</Link></li>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">Admin</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    <li><Link to="Dashboard">Dashboard</Link></li>
    <li><Link to="/AddProductForm">Product</Link></li>
    </ul>
  </div>
  <div className="navbar-end">
  <Link to="#" onClick={handleLogout} className="btn btn-ghost text-sm">
       ออกจากระบบ
        </Link>
  </div>
</div>
    </div>
  )
}

export default Navbar
