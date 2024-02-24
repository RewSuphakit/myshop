import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function OrderStatus() {
  const { id } = useParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({});

  const convertToThaiTime = (isoDate) => {
    const dateParts = isoDate.split("T")[0].split("-");
    const timeParts = isoDate.split("T")[1].split(":");
    const thaiDate = `${dateParts[2]}/${dateParts[1]}/${
      Number(dateParts[0]) + 543
    } ${timeParts[0]}:${timeParts[1]}:${timeParts[2].split(".")[0]}`;

    return thaiDate;
  };
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      let token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/order/status/${orderId}`,
        {
          status: newStatus
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: newStatus
      }));
    } catch (error) {
      console.error(`Error marking order as ${newStatus}:`, error.message);
    }
  };
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/order/order/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              include: {
                orderItems: true,
                payments: true
              }
            }
          }
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching order:", error.message);
      }
    };
    fetchOrder();
  }, [id]);
  const statusColors = {
    pending: "bg-yellow-500 text-white px-2 py-1 rounded-md text-xs ",
    Cancelled: "bg-red-500 text-white px-2 py-1 rounded-md text-xs",
    Delivered: "bg-blue-500 text-white px-2 py-1 rounded-md text-xs",
    Succeed: "bg-green-500 text-white px-2 py-1 rounded-md text-xs"
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดสินค้าและสถานะ</h1>
      <div className="overflow-y-auto max-h-[600px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {orders &&
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order.order_id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {user.first_name}
                </p>
                <p>
                  <span className="font-semibold">Order Date:</span>{" "}
                  {convertToThaiTime(order.order_date)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>
                  <span
                    className={
                      statusColors[status[order.order_id] || order.status]
                    }
                  >
                    {status[order.order_id] || order.status}
                  </span>
                </p>

                <h2 className="text-lg font-semibold mt-4">Order Items</h2>
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div
                      key={item.order_item_id}
                      className="mt-2 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            item.product?.image
                              ? `http://localhost:8000/${item.product.image.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : null
                          }
                          alt={item.product.name}
                          className="w-16 h-16 rounded-full mr-4"
                        />
                        <p className="text-warp text-balance  text">
                          {item.product?.name}   x{item.quantity}
                        </p>
                      </div>
                      <p>{item.price_per_item * item.quantity} บาท</p>
                    </div>
                  ))}

                <h2 className="text-lg font-semibold mt-4">Payments</h2>
                {order.payments &&
                  order.payments.map((payment) => (
                    <div key={payment.payment_id} className="mt-2">
                      <p>
                        <span className="font-semibold">Payment Method:</span>{" "}
                        {payment.payment_method} -{" "}
                        <span className="font-semibold">Total Amount:</span>{" "}
                        {payment.total_amount} บาท
                      </p>
                    </div>
                  ))}

{order.status === 'Cancelled' && (
  <div>

  </div>
)}

{order.status === 'pending' && (
    <button 
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
        onClick={() => handleOrderStatusChange(order.order_id, 'Cancelled')}
    >
        Cancel
    </button>
)}

{order.status === 'Delivered' && (
    <button 
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
        onClick={() => handleOrderStatusChange(order.order_id, 'Succeed')}
    >
        Received
    </button>
)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
