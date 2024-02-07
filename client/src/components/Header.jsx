import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const finalNav = user?.user_id && (
    <>
    
      <li className=" text-xl font-bold  pb-2">
        <Link to="/Profile">โปรฟาย</Link>
      </li>
      <li className=" text-xl font-bold  pb-2">
        <Link to="/Profile">ประวัตการสั่งซื้อ</Link>
      </li>
      <li className=" text-xl font-bold pb-2">
        <Link to="#" onClick={handleLogout}>
          ออกจากระบบ
        </Link>
      </li>
      <div className="divider"></div>
      <label className="flex cursor-pointer gap-2  justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
  <input type="checkbox" value="dim" className="toggle theme-controller"/>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</label>
    </>
  );

  return ( 
    <div className="border">
   <div className="navbar  container mx-auto  rounded-lg">
  <div className="navbar-start ">
    <div className="dropdown ">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ">
        <li>  <Link to="/">Home</Link></li>
        <li>
          <a>Product</a>
          <ul className="p-2">
            <li><a>Product 1</a></li>
            <li><a>Product 2</a></li>
          </ul>
        </li>
        <li><a>Contact</a></li>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">{user?.user_id ? [user.first_name, ' ', user.last_name] : 'Guest'}</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 z-10">
      <li>  <Link to="/">Home</Link></li>
      <li>
        <details>
          <summary>Product</summary>
          <ul className="p-4">
            <li className="p-1"><a>REW</a></li>
            <li className="p-1"><a>FERN</a></li>
          </ul>
        </details>
      </li>
      <li><a>Contact</a></li>
    </ul>
  </div>
  

      
  <div className="navbar-end">
  <div className="dropdown dropdown-end ">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="badge badge-sm indicator-item">0</span>
        </div>
      </div>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div className="card-body">
          <span className="font-bold text-lg">8 Items</span>
          <span className="text-info">Subtotal: $999</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block">View cart</button>
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
        <div className="flex  ">
        <div ><Link to="/login" className="btn btn-ghost">Login</Link></div>
        {/* <div className="divider divider-horizontal"></div>  */}
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
