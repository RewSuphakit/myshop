//authController  Register,Login,Profile
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/db');

exports.register = async (req, res ) => {
  const { first_name, last_name, email, password, confirmPassword } = req.body;
  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ error: 'Confirm password does not match' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword
      },
    });

    res.status(200).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่าอีเมลและรหัสผ่านไม่ว่างเปล่า
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.users.findUnique({ where: { email } });

    // ตรวจสอบว่ามีผู้ใช้ในระบบหรือไม่
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: 'User not found' });
    }

    // ตรวจสอบความถูกต้องของรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ error: 'Invalid password' });
    }

    // สร้าง JWT token
    const payload = {
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ส่งคำตอบกลับไปพร้อมกับ token และข้อมูลผู้ใช้ (ไม่รวมรหัสผ่าน)
    const userWithoutPassword = { ...user, password: undefined };
    res.status(200).json({ message: 'Login successful', token, payload: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.CountUsers = async (req, res) => {
  try {
    const count = await prisma.users.count({
      where: {
        role: 'User'
      }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { user_id, first_name, last_name, email, role, addresses, shoppingCartItems, orders, reviews,updated_at } = req.user;
    if (role !== 'Admin' && role !== 'User') {
      return res.status(403).json({ error: 'Unauthorized: Invalid user role' });
    }

    const userProfile = {
      user_id,
      first_name,
      last_name,
      email,
      updated_at,
      role,
      addresses,
      shoppingCartItems,
      orders,
      reviews
    };
  
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateUserProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    const userId = req.params.id;
    const updateProfile = await prisma.users.update({
      where: { user_id: parseInt(userId) },
      data: {
        first_name,
        last_name,
        updated_at: new Date(),
      },
    });

    delete updateProfile.password;
    

    res.status(200).json({ users: updateProfile });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};