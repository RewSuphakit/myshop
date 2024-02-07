// app Router.jsx
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../pages/LoginForm'
import RegisterForm from '../pages/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UserPage from '../pages/users/UserPage'
import AdminPage from '../pages/admin/AdminPage'
import UserProfile from '../pages/users/UserProfile'
// สร้าง Router สำหรับผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ
const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
      <Footer/>
    </>,
    children: [
      // หน้าหลักที่เป็นหน้า login
      { index: true, element: <LoginForm /> },
      // หน้าลงทะเบียน
      { path: '/register', element: <RegisterForm />}
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
      <Footer/>
    </>,
    children : [
      // หน้าหลักสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
      { index: true, element: <UserPage /> },
      // หน้ารายการสิ่งที่ต้องทำสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
      { path: '/Profile', element: <UserProfile/>}
    ]
  }
]);

// สร้าง Router สำหรับผู้ใช้ที่เป็น Admin
const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Outlet />
    </>,
    children : [
      // หน้าหลักสำหรับผู้ใช้ที่เป็น Admin
      { index: true, element: <AdminPage /> },
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