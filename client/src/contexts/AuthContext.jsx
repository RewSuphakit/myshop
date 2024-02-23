/* eslint-disable react/prop-types */
import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();

// สร้าง Provider สำหรับ Context เพื่อให้ความสามารถในการแชร์ข้อมูล
function AuthContextProvider(props) {
  // สร้าง state เพื่อเก็บข้อมูลผู้ใช้และสถานะการโหลด
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null); // เพิ่ม state เก็บค่า lastUpdatedAt

  // useEffect ทำงานเมื่อ user หรือ lastUpdatedAt เปลี่ยนแปลง
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) { return; }
        
        const rs = await axios.get('http://localhost:8000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(rs.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [lastUpdatedAt]); // เมื่อ lastUpdatedAt เปลี่ยนแปลง

  console.log(user);
  
  // ฟังก์ชันสำหรับการออกจากระบบ
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  }
   
  // ส่งค่า value ที่ต้องการให้ Context มีไปใน child components
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

// ส่งออก AuthContextProvider เพื่อนำไปใช้ในที่อื่น
export { AuthContextProvider }
// ส่งออก AuthContext เพื่อให้ child components อื่น ๆ นำไปใช้
export default AuthContext;
