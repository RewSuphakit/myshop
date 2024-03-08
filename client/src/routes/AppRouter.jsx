import React from 'react'; // นำเข้า React
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"; // นำเข้า createBrowserRouter, RouterProvider, และ Outlet
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProduct from "../pages/users/UserProduct";
import UserProfile from "../pages/users/UserProfile";
import AdminPage from "../pages/admin/AdminPage";
import AddProductForm from "../pages/admin/addProductForm"
import  Navbar from '../pages/admin/Navbar'
import Dashboard from '../pages/admin/Dashboard'
import ListProduct from '../pages/admin/listProduct'
import EditProduct from '../pages/admin/editProduct'
import NotFound from "../components/NotFound";
import HomePage from "../pages/HomePage";
import ProductDetails from "../layouts/ProductDetails";
import Cart from "../layouts/cart";
import CheckOut from "../layouts/CheckOut";
import Contact from "../components/contact";
import About from "../components/About";
import Address from '../pages/users/address'
import OrderStatus from '../pages/users/orderStatus'
import OrderHistory from '../pages/users/orderHistory'
import PaymentSuccess from '../components/paymentSuccess'
// สร้าง Router สำหรับผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ
const guestRouter = createBrowserRouter([
  {
    path: "/MyShops/",
    element: (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      // หน้าหลัก
      { index: true, element: <HomePage /> },
      // หน้าเข้าสู่ระบบ
      { path: "/MyShops/login", element: <LoginForm /> },
      // หน้าลงทะเบียน
      { path: "/MyShops/register", element: <RegisterForm /> },
      { path: "/MyShops/Contact", element: <Contact /> },
      { path: "/MyShops/About", element: <About /> },

      // เพิ่มเส้นทางสำหรับ 404 Not Found
      { path: "*", element: <NotFound /> }
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
const userRouter = createBrowserRouter([
  {
    path: "/MyShops/",
    element: (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      { index: true, element: <UserProduct /> },
      { path: "/MyShops/UserProduct", element: <UserProduct /> },
      { path: "/MyShops/ProductDetails/:id", element: <ProductDetails /> },
      { path: "/MyShops/Cart/:id", element: <Cart /> },
      { path: "/MyShops/Profile", element: <UserProfile /> },
      { path: "/MyShops/Profile/address", element: <Address /> },
      { path: "/MyShops/Profile/orderStatus", element: <OrderStatus /> }, 
      { path: "/MyShops/Profile/orderHistory", element: <OrderHistory /> }, 
      { path: "/MyShops/CheckOut", element: <CheckOut /> },
      { path: "/MyShops/CheckOut/paymentSuccess", element: <PaymentSuccess /> },
      { path: "/MyShops/*", element: <NotFound /> },
     { path: "/MyShops/Contact", element: <Contact /> },
     { path: "/MyShops/About", element: <About /> },
      
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เป็น Admin
const adminRouter = createBrowserRouter([
  {
    path: "/MyShops/",
    element: (
      <>
        <Navbar/>
        <Outlet />
      </>
    ),
    children: [
      // หน้าหลักสำหรับผู้ใช้ที่เป็น Admin
      { index: true, element: <Dashboard /> },
      { path: "/MyShops/Dashboard", element: <Dashboard /> },
      { path: "/MyShops/AddProductForm", element: <AddProductForm/> },
      { path: "/MyShops/Dashboard", element: <Dashboard />},
      { path: "/MyShops/ListProduct", element: <ListProduct /> },
      { path:"/MyShops/EditProduct/:id",element :<EditProduct />},
      { path: "/MyShops/*", element: <NotFound /> }
      // อื่น ๆ ที่เฉพาะสำหรับผู้ใช้ที่เป็น Admin
    ]
  }
]);

// ตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้และเลือก Router ที่เหมาะสม
export default function AppRouter() {
  const { user } = useAuth();

  // เช็คว่ามีข้อมูลผู้ใช้และมี role เป็น Admin หรือไม่
  const isAdmin = user?.role === "Admin";

  // เลือก Router ตามสถานะการเข้าสู่ระบบและบทบาทของผู้ใช้
  const finalRouter = user ? (isAdmin ? adminRouter : userRouter) : guestRouter;

  // ส่ง Router ที่เลือกไปยัง RouterProvider เพื่อให้ระบบทำงาน
  return <RouterProvider router={finalRouter} />;
}
