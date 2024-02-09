/* eslint-disable react/prop-types */
// นำเข้าโมดูล axios เพื่อทำ HTTP requests
import axios from 'axios'
// นำเข้า createContext, useState, และ useEffect จาก React
import { createContext, useState, useEffect } from 'react'

// สร้าง Context สำหรับการจัดการข้อมูลการเข้าสู่ระบบ
const AuthContext = createContext()

// สร้าง Provider สำหรับ Context เพื่อให้ความสามารถในการแชร์ข้อมูล
function AuthContextProvider(props) {
  // สร้าง state เพื่อเก็บข้อมูลผู้ใช้และสถานะการโหลด
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // useEffect ทำงานครั้งแรกเพื่อตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    const run = async () => {
      try {
        // กำหนดสถานะ loading เป็น true เพื่อแสดงว่ากำลังโหลดข้อมูล
        setLoading(true)
        // ดึง token จาก localStorage
        let token = localStorage.getItem('token')
        // ถ้าไม่มี token ใน localStorage ให้จบการทำงาน
        if (!token) { return }
        // ทำ HTTP request เพื่อตรวจสอบข้อมูลผู้ใช้
        const rs = await axios.get('http://localhost:8000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        // กำหนดข้อมูลผู้ใช้ใน state
        setUser(rs.data)
      } catch (err) {
        console.log(err.message)
      } finally {
        // กำหนดสถานะ loading เป็น false เมื่อทำงานเสร็จสิ้น
        setLoading(false)
      }
    }
    // เรียกฟังก์ชัน run เมื่อ useEffect ทำงาน
    run()
  }, [])

  // ฟังก์ชันสำหรับการออกจากระบบ
  const logout = () => {
    // กำหนดข้อมูลผู้ใช้ใน state เป็น null
    setUser(null)
    // ลบ token ใน localStorage
    localStorage.removeItem('token')
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
export default AuthContext
