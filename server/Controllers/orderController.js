const prisma = require('../models/db')

const countOrder = async (req, res) => {
  try {
    const totalOrders = await prisma.orders.count();
    res.status(200).json({ totalOrders });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: 'Error getting the total count of Orders' });
  }
}

const listOrder = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        user: true, 
        orderItems: {
          include: {
            product: true, 
            address: true   
          }
        }
      }
    });
    
    // จัดกลุ่มรายการสั่งซื้อตามที่อยู่ที่ไม่ซ้ำกันภายในคำสั่งเดียวกัน
    const formattedOrders = orders.map(order => {
      const groupedItems = {};
      order.orderItems.forEach(item => {
        const addressId = item.address.address_id;
        if (!groupedItems[addressId]) {
          groupedItems[addressId] = {
            address: {
              recipientName: item.address.recipient_name,
              addressLine1: item.address.address_line1,
              addressLine2: item.address.address_line2,
              city: item.address.city,
              state: item.address.state,
              postalCode: item.address.postal_code,
              phone: item.address.phone
            },
            items: []
          };
        }
        groupedItems[addressId].items.push({
          quantity: item.quantity,
          price: item.price_per_item,
          productName: item.product.name
        });
      });
      
      // สร้างวัตถุรูปแบบคำสั่งซื้อเพื่อรวมรายละเอียดคำสั่งซื้อพร้อมที่อยู่ที่จัดกลุ่มและสินค้าของพวกเขา
      return {
        orderId: order.order_id,
        orderDate: order.order_date,
        status: order.status,
        userBuy: `${order.user.first_name} ${order.user.last_name}`,
        addresses: Object.values(groupedItems)
      };
    });
    
    res.status(200).json({ orders: formattedOrders });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: 'Error getting the list of orders' });
  }
}

const getOrderById = async (req, res) => {
    const userId = req.params.id;
    try {
      const order = await prisma.orders.findMany({
        where: {
          user_id: parseInt(userId)
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          payments: true
        },
        orderBy: {
          order_id: 'desc' // เรียงจากมากไปน้อย
        }
      });
      if (!order) {
        return res.status(404).json({ message: 'ไม่พบคำสั่ง' });
      }
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
    }
};

  const updateOrderStatus = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    try {
      const updatedOrder = await prisma.orders.update({
        where: {
          order_id: orderId
        },
        data: {
          status: status
        }
      });
      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
    }
  };

// ฟังก์ชันสำหรับลบคำสั่ง
const deleteOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    await prisma.orders.delete({
      where: {
        order_id: orderId
      }
    });
    res.json({ message: 'ลบคำสั่งเรียบร้อยแล้ว' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
};

module.exports = {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  countOrder,
  listOrder
};
