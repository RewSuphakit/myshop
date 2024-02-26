import React, { useEffect, useState } from "react";
import axios from "axios";

function Order() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const convertToThaiTime = (isoDate) => {
    const dateParts = isoDate.split("T")[0].split("-");
    const timeParts = isoDate.split("T")[1].split(":");
    const thaiDate = `${dateParts[2]}/${dateParts[1]}/${Number(dateParts[0]) + 543} ${timeParts[0]}:${timeParts[1]}:${timeParts[2].split(".")[0]}`;
    return thaiDate;
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      let token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/order/status/${orderId}`,
        {
            status: newStatus 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrder();
    } catch (error) {
      console.error("Error changing order status:", error.message);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);


    const fetchOrder = async () => {
      try {
        let token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/order/listOrder`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingOrders = res.data.orders.filter(order => order.status === 'pending');
        setOrders(pendingOrders);
      } catch (error) {
        console.error("Error fetching order:", error.message);
      }
    };
  

  const statusColors = {
    pending: "bg-yellow-500 text-white px-2 py-1 rounded-md text-xs ",
    Cancelled: "bg-red-500 text-white px-2 py-1 rounded-md text-xs",
    Delivered: "bg-blue-500 text-white px-2 py-1 rounded-md text-xs",
    Succeed: "bg-green-500 text-white px-2 py-1 rounded-md text-xs"
  };

  return (
    <div className="container mx-auto">
  <h1 className="text-2xl font-bold mb-4">รายการออเดอร์</h1>
  <div className="overflow-y-auto max-h-[600px]">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
      {orders &&
        orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-lg shadow-md p-4">
            <p><span className="font-semibold">Order ID:</span> {order.orderId}</p>
            <p><span className="font-semibold">Name:</span> {order.userBuy}</p>
            <p><span className="font-semibold">Order Date:</span> {convertToThaiTime(order.orderDate)}</p>
            <p>
              <span className="font-semibold">Status:</span>
              <span className={statusColors[order.status] || statusColors["pending"]}>{order.status}</span>
              {/* เพิ่มปุ่มเปลี่ยนสถานะ */}
              {order.status !== 'Delivered' && (
                <button onClick={() => handleChangeStatus(order.orderId, 'Delivered')} className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md text-xs">จัดสงแล้ว(กดปุ่ม)</button>
              )}
            </p>
            <h2 className="text-lg font-semibold mt-4">Order Items</h2>
            {order.addresses &&
              order.addresses.map((address, index) => (
                <div key={index}>
                  {address.items &&
                    address.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-warp text-balance text">{item.productName} x{item.quantity}</p>
                        </div>
                        <p>{item.price} บาท</p>
                      </div>
                    ))}
                  <h2 className="text-lg font-semibold mt-4">Order Address</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{address.address.recipientName}</h3>
                      <p>{address.address.addressLine1}</p>
                      <p>{address.address.addressLine2}</p>
                      <p>{address.address.city}, {address.address.state}, {address.address.postalCode}</p>
                      <div className="font-bold">{address.address.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  </div>
</div>
  );
}

export default Order;
