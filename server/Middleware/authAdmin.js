// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const prisma = require('../models/db');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('Unauthorized: Missing Authorization header');
    }
    if (!authorization.startsWith('Bearer')) {
      throw new Error('Unauthorized: Invalid Authorization header');
    }
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.user || !payload.user.email || !payload.user.role) {
      throw new Error('Unauthorized: Invalid token payload');
    }

    const user = await prisma.users.findUnique({ where: { email: payload.user.email } });
    if (!user) {
      throw new Error('Unauthorized: User not found');
    }

    // เพิ่มการตรวจสอบ Role ที่นี่
    if (user.role !== 'Admin') {
      throw new Error('Unauthorized: User does not have permission');
    }

    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
