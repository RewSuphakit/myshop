const prisma = require('../models/db')

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await prisma.payments.findMany();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createPayment = async (req, res, next) => {
  const { order_id, payment_method, total_amount } = req.body;
  try {
    const newPayment = await prisma.payments.create({
      data: {
        order_id,
        payment_method,
        total_amount
      }
    });
    res.json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
