const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  deleteOrder
};
