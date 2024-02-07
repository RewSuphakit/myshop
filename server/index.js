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
const productRoutes = require('./Routers/productRouter'); // Import productRouter
const addressRoutes = require('./Routers/addressRoutes')
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Prisma middleware
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Use authenticate middleware for routes that require authentication
app.use('/auth', authRoutes);
app.use('/address',addressRoutes)
// api/product
app.use('/api', productRoutes); 

app.listen(port, () => {
    console.log(`Server is running on port`, port);
});
