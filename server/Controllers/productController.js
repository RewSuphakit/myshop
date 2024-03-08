const prisma = require('../models/db')
const sharp = require('sharp');
const fs = require('fs');
const PAGE_SIZE = 100; 
exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 100;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let query = {
      skip,
      take,
      include: {
        Category: true
      }
    };

    if (req.query.sort === 'desc') {
      query = {
        ...query,
        orderBy: {
          created_at: 'desc' 
        }
      };
    } else {
      query = {
        ...query,
        orderBy: {
          created_at: 'asc'
        }
      };
    }

    if (req.query.category) {
      const categoryId = parseInt(req.query.category);
      query = {
        ...query,
        where: {
          Category_id: categoryId 
        }
      };
    }

    let products = await prisma.products.findMany(query);
    
    products = products.map(product => {
      return {
        ...product,
        image: product.image 
      };
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
      include: {
        Category: true 
      }
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }


    const productWithCorrectedImageURL = {
      ...product,
      image: product.image
    };

    res.json(productWithCorrectedImageURL);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};
exports.create = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, Category_id } = req.body;

    
    const image =  req.file.filename ; 
   
    const newProduct = await prisma.products.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        Category_id: parseInt(Category_id), 
        image: image
      }
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error: Failed to create product' });
  }
};

exports.update = async (req, res) => {
  try {
    let image = null; 

    const productId = parseInt(req.params.id);
    const { name, description, price, stock_quantity, category_id } = req.body;


    if (!name || !description || !price || isNaN(price) || !stock_quantity || isNaN(stock_quantity) || category_id === null) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }


    const existingProduct = await prisma.products.findUnique({
      where: { product_id: productId }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.file) {
      image = req.file.filename; 
      
      if (existingProduct.image) {
        fs.unlinkSync(`uploads/${existingProduct.image}`);
      }
    }

    const updatedProduct = await prisma.products.update({
      where: { product_id: productId },
      data: {
        name,
        description,
        updated_at: new Date(), 
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        image: image || existingProduct.image, 
        Category: { 
          connect: { category_id: parseInt(category_id) }
        }
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
    const product = await prisma.products.findUnique({
      where: { product_id: productId },
      select: { image: true } 
    });
    await prisma.products.delete({
      where: { product_id: productId },
    });
    if (product && product.image) {
      fs.unlinkSync(`uploads/${product.image}`);
    }
    res.status(204).send(`Product with ID ${productId} has been deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};
