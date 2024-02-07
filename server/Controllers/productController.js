const prisma = require('../models/db')
const PAGE_SIZE = 10; // จำนวนรายการต่อหน้า
exports.list = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1; // หน้าปัจจุบัน, default เป็น 1
      const pageSize = parseInt(req.query.pageSize) || 10; // จำนวนรายการต่อหน้า, default เป็น 10
  
      const skip = (page - 1) * pageSize; // ถ้าหน้าเป็น 1, จะไม่มีการ skip, ถ้าหน้าเป็น 2 จะ skip 10 รายการ
      const take = pageSize; // จำนวนรายการที่จะดึงมาแสดง
  
      const products = await prisma.products.findMany({
        skip,
        take,
      });
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } finally {
      await prisma.$disconnect();
    }
  };
exports.read = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.products.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, image } = req.body;
    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock_quantity,
        image,
      },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.update = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock_quantity, image } = req.body;
    const updatedProduct = await prisma.products.update({
      where: { product_id: productId },
      data: {
        name,
        description,
        price,
        stock_quantity,
        image,
      },
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.remove = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.products.delete({
      where: { product_id: productId },
    });

    res.send(`Product with ID ${productId} has been deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};
