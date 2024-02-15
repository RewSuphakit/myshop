const prisma = require('../models/db')


exports.listOrder = async (req, res, next) => {
    try {
      const { userId } = req.body;
      const orders = await prisma.orders.findMany({where: {user_id: userId}});
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };
  exports.addOrder = async (req, res, next) => {
      try {
        const { userId } = req.body;
        const parsedUserId = parseInt(userId);
        const newOrder = await prisma.orders.create({
            data: {
                user_id: userId
            },
        });
        res.json(newOrder);
    } catch (error) {
        next(error);
    }
};
  exports.readOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);
    try {
      const order = await prisma.orders.findUnique({
        where: {
          order_id: orderId,
        },
      });
      res.json(order);
    } catch (error) {
      next(error);
    }
  };
  
  exports.updateOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    try {
      const updatedOrder = await prisma.orders.update({
        where: {
          order_id: orderId,
        },
        data: {
          status: status,
        },
      });
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);
    try {
      await prisma.orders.delete({
        where: {
          order_id: orderId,
        },
      });
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      next(error);
    }
  };