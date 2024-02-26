import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBox } from "react-icons/fa";
import { FaBahtSign } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import SalesChart from './Chart/SalesChart'
import DistributionChart from './Chart/DistributionChart'
import OrderChart from './Chart/OrderChart'
import Order from './order'
function Dashboard() {
  const [products, setProducts] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [payment, setPayment] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [productsRes, countUsersRes, countOrderRes, paymentRes] =
          await Promise.all([
            axios.get(`${apiUrl}/api/products/`),
            axios.get(`${apiUrl}/auth/countUsers`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${apiUrl}/order/countOrder`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${apiUrl}/payment/payments`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

        // Set product count, user count, order count
        setProducts(productsRes.data);
        setCountUsers(countUsersRes.data.count);
        setCountOrder(countOrderRes.data.totalOrders);

        // Calculate total sales
        const totalSalesAmount = paymentRes.data.reduce(
          (acc, payment) => acc + payment.total_amount,
          0
        );
        setTotalSales(totalSalesAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);
  const numberWithCommas = (number) => {
    return number.toLocaleString("en-US");
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold my-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-blue-500 bg-blue-500 text-white p-4 shadow-md rounded-md flex items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold mb-2">รายการสมาชิก</h5>
            <p>{countUsers}</p>
          </div>
          <FaUsers size={30} />
        </div>
        <div className="border border-green-500 bg-green-500 text-white p-4 shadow-md rounded-md flex items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold mb-2">รายการสินค้า</h5>
            <p>{products.length}</p>
          </div>
          <FaBox size={30} />
        </div>
        <div className="border border-pink-500 bg-pink-500 text-white p-4 shadow-md rounded-md flex items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold mb-2">รายการออเดอร์</h5>
            <p>{countOrder}</p>
          </div>
          <FaShoppingCart size={30} />
        </div>
        <div className="border border-yellow-500 bg-yellow-500 text-white p-4 shadow-md rounded-md flex items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold mb-2">ยอดขาย</h5>
            <p>{numberWithCommas(totalSales)}</p>
          </div>
          <FaBahtSign size={30} />
        </div>
      </div>
           {/* <!-- SalesChart --> */}
         <div className="mt-8">
            <div className="bg-white p-4 shadow-md rounded-md">
              <SalesChart/>
            </div>
        </div>
        {/* <!-- Product Distribution Chart --> */}
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 shadow-md rounded-md">
                <DistributionChart/>
                </div>
             {/* <!-- Order Chart --> */}
                <div className="bg-white p-4 shadow-md rounded-md">
              <OrderChart/>
            </div>
        </div>
      </div>

        <div className="mt-8">
            <div className="bg-white p-4 shadow-md rounded-md">
            <Order/>
            </div>
        </div>
       




    </div>
  );
}

export default Dashboard;
