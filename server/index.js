// index.js
const express = require('express');
const app = express();
require("dotenv").config();
const { readdirSync } = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const prisma = require('./models/db');
const authRoutes = require('./Routers/authRoutes');
const authenticate = require('./middleware/authenticate');
const productRoutes = require('./Routers/productRouter');
const addressRoutes = require('./Routers/addressRoutes');
const paymentRoutes = require('./Routers/paymentRoutes');
const checkoutRouter = require('./Routers/checkoutRouter');
const port = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Prisma middleware
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/address',addressRoutes)
// api/product
app.use('/api', productRoutes); 
// Payment
app.use('/payment',paymentRoutes);
// Order
// app.use('/order', orderRoutes);
app.use('/checkout', checkoutRouter);


app.listen(port, () => {
    console.log(`Server is running on port`, port);
});
