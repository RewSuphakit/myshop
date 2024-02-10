const prisma = require('../models/db');

// เพิ่มสินค้าลงในตะกร้า
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // ตรวจสอบว่า userId, productId, และ quantity เป็น integer ที่ถูกต้องหรือไม่
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: 'userId, productId, and quantity are required' });
        }

        const parsedUserId = parseInt(userId);
        const parsedProductId = parseInt(productId);
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedUserId) || isNaN(parsedProductId) || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'Invalid userId, productId, or quantity' });
        }
        // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
        let cart = await prisma.shoppingCart_Items.findFirst({
            where: {
                user_id: parsedUserId,
                product_id: parsedProductId
            },
            include: {
                product: true
            }
        });

        if (!cart) {
            // ถ้ายังไม่มีสินค้าในตะกร้า จะสร้างสินค้าใหม่
            await prisma.shoppingCart_Items.create({
                data: {
                    user_id: parsedUserId,
                    quantity: parsedQuantity,
                    product_id: parsedProductId
                },
            });
        } else {
            // ถ้ามีสินค้าอยู่แล้วในตะกร้า
            // เพิ่มจำนวนสินค้าในตะกร้าเมื่อ productId ซ้ำซ้อน
            const updatedQuantity = cart.quantity + parsedQuantity;
            await prisma.shoppingCart_Items.update({
                where: {
                    cart_item_id: cart.cart_item_id, // เพิ่ม cart_item_id เข้าไปใน where เพื่อระบุรายการสินค้าที่ต้องการอัปเดต
                },
                data: {
                    quantity: updatedQuantity
                },
            });
        }

        return res.status(200).json({ message: 'Product added to cart successfully.' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// ดึงข้อมูลสินค้าในตะกร้า
exports.getCartItems = async (req, res) => {
    try {
        const { id: userId } = req.params;
        
        // Ensure userId is a valid integer
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const cartItems = await prisma.shoppingCart_Items.findMany({
            where: {
                user_id: parsedUserId
            },
            include: {
                product: true
            }
        });

        return res.status(200).json({ cartItems });
    } catch (error) {
        console.error('Error getting cart items:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// อัปเดตจำนวนสินค้าในตะกร้า
exports.updateCartItems = async (req, res) => {
    try {
        // แยก cartItemId และ quantity จากพารามิเตอร์ของคำขอ
        const { id:cartItemId } = req.params;
        const { quantity } = req.body;

        // ตรวจสอบให้แน่ใจว่า cartItemId และ quantity เป็น integer ที่ถูกต้อง
        const parsedCartItemId = parseInt(cartItemId);
        const parsedQuantity = parseInt(quantity);

        // ถ้า cartItemId หรือ quantity ไม่ใช่ตัวเลขหรือ quantity น้อยกว่า 0
        // ให้ส่งข้อความแจ้งเตือนว่าข้อมูลไม่ถูกต้อง
        if (isNaN(parsedCartItemId) || isNaN(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({ error: 'Invalid cartItemId or quantity' });
        }

        // ตรวจสอบว่ารายการสินค้าในตะกร้ามีอยู่หรือไม่
        let cartItem = await prisma.shoppingCart_Items.findFirst({
            where: {
                cart_item_id: parsedCartItemId
            }
        });

        // ถ้าไม่มีรายการสินค้า
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // อัปเดตจำนวนสินค้าในตะกร้า
        await prisma.shoppingCart_Items.update({
            where: {
                cart_item_id: parsedCartItemId
            },
            data: {
                quantity: parsedQuantity
            }
        });

        // ส่งข้อความว่าอัปเดตรายการสินค้าในตะกร้าสำเร็จ
        return res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        // ถ้าเกิดข้อผิดพลาดในระหว่างการอัปเดต
        console.error('Error updating cart item:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// ลบสินค้าออกจากตะกร้า
exports.deleteCartItem = async (req, res) => {
    try {
        const { id:cartItemId  } = req.params;

        // Ensure cartItemId is provided and a valid integer
        if (!cartItemId) {
            return res.status(400).json({ error: 'cartItemId is required' });
        }

        const parsedCartItemId = parseInt(cartItemId);

        if (isNaN(parsedCartItemId)) {
            return res.status(400).json({ error: 'Invalid cartItemId' });
        }

        await prisma.shoppingCart_Items.deleteMany({
            where: {
                cart_item_id: parsedCartItemId
            },
        });
        return res.status(200).json({ message: 'Product removed from cart successfully.' });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};