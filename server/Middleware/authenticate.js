// middleware/authenticate.js
// ตรวจเช็ค Token
const jwt = require('jsonwebtoken');
const prisma = require('../models/db');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
    }
    if (!authorization.startsWith('Bearer')) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Authorization header' });
    }
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.user || !payload.user.email || !payload.user.role) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    const user = await prisma.users.findUnique({ where: { email: payload.user.email } });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    if (user.role !== 'Admin' && user.role !== 'User') {
      return res.status(403).json({ error: 'Unauthorized: Invalid user role' });
    }

    delete user.password;
    req.user = user;
    await prisma.$disconnect(); // ปิดการเชื่อมต่อ Prisma หลังจากใช้งานเสร็จสิ้น
    next();
  } catch (err) {
    await prisma.$disconnect(); // ปิดการเชื่อมต่อ Prisma ในกรณีเกิดข้อผิดพลาด
    next(err);
  }
};
