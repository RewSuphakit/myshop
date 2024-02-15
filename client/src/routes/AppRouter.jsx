// app Router.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginForm from '../pages/LoginForm';
import RegisterForm from '../pages/RegisterForm';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProduct from '../pages/users/UserProduct';
import AdminPage from '../pages/admin/AdminPage';
import UserProfile from '../pages/users/UserProfile';
import NotFound from '../components/NotFound';
import HomePage from '../pages/HomePage';
import ProductDetails from '../layouts/ProductDetails'
import Cart from '../layouts/cart'
import CheckOut from "../layouts/CheckOut";
// สร้าง Router สำหรับผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ

const guestRouter = createBrowserRouter([
  {
    path: '/',
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
      { path: '/login', element: <LoginForm /> },
      // หน้าลงทะเบียน
      { path: '/register', element: <RegisterForm /> },
      // เพิ่มเส้นทางสำหรับ 404 Not Found
      { path: '*', element: <NotFound /> }
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
const userRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      // หน้าหลักสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
      { index: true, element: <UserProduct /> },
      // หน้ารายการสิ่งที่ต้องทำสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
      { path: '/UserProduct', element: <UserProduct /> },
      { path: '/ProductDetails/:id', element: <ProductDetails /> },
      { path: '/Cart/:id', element: <Cart /> },
      { path: '/Profile', element: <UserProfile /> },
      { path:  '/CheckOut',element: <CheckOut /> },
      // เพิ่มเส้นทางสำหรับ 404 Not Found
      { path: '*', element: <NotFound /> },
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เป็น Admin
const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      // หน้าหลักสำหรับผู้ใช้ที่เป็น Admin
      { index: true, element: <AdminPage /> },
      { path: '/AdminPage', element: <AdminPage /> },
        
      { path: '*', element: <NotFound /> },
      // อื่น ๆ ที่เฉพาะสำหรับผู้ใช้ที่เป็น Admin
    ]
  }
]); 

// ตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้และเลือก Router ที่เหมาะสม
export default function AppRouter() {
  const { user } = useAuth();
  
  // เช็คว่ามีข้อมูลผู้ใช้และมี role เป็น Admin หรือไม่
  const isAdmin = user?.role === 'Admin';
  
  // เลือก Router ตามสถานะการเข้าสู่ระบบและบทบาทของผู้ใช้
  const finalRouter = user ? (isAdmin ? adminRouter : userRouter) : guestRouter;
  
  // ส่ง Router ที่เลือกไปยัง RouterProvider เพื่อให้ระบบทำงาน
  return (
    <RouterProvider router={finalRouter} />
  );
}
