const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkout = async (req, res) => {
    try {
        const { userId } = req.body;

        // ดึงข้อมูลตะกร้าสินค้าของผู้ใช้
        const cartItems = await prisma.shoppingCart_Items.findMany({
            where: { user_id: userId },
            include: { product: true }
        });

        // สร้างรายการสั่งซื้อใหม่
        const order = await prisma.orders.create({
            data: {
                user_id: userId,
                status: 'pending'
            }
        });

        // เพิ่มรายการสินค้าในตะกร้าเข้าไปในรายการสั่งซื้อ
        for (const cartItem of cartItems) {
            await prisma.orderItems.create({
                data: {
                    order_id: order.order_id,
                    product_id: cartItem.product.product_id,
                    quantity: cartItem.quantity,
                    price_per_item: cartItem.product.price
                }
            });

            // ลบรายการสินค้าที่ถูก Check out ออกจากตะกร้า
            await prisma.shoppingCart_Items.delete({
                where: { cart_item_id: cartItem.cart_item_id }
            });
        }

        res.status(200).json({ message: 'Checkout successful', orderId: order.order_id });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Failed to checkout' });
    }
};
