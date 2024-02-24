//authController  Register,Login,Profile
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/db');

exports.register = async (req, res ) => {
  const { first_name, last_name, email, password, confirmPassword, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validation
    if (!(email && password && confirmPassword)) {
      return res.status(400).json({ error: 'Fulfill all inputs' });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ error: 'Confirm password does not match' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(200).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res ) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    
    if (!user) {
      console.log("User not found")
      return res.status(401).send({ error: 'User not found' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password")
      return res.status(401).json({ error: 'Invalid password' });
    }
    const payload = { 
      user:{ 
        email:user.email, 
        role: user.role}
    
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token,user, payload });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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