const db = require("../models/db");
exports.getAddress = async (req, res, next) => {
    try {
        const addresses = await db.address.findMany({
            where: { user_id: req.user.user_id }
        });
       
        // ถ้าพบที่อยู่ ส่งข้อมูลกลับไปยังผู้ใช้
        res.send({ addresses });
    } catch (error) {
        // การจัดการข้อผิดพลาดเมื่อเกิดข้อผิดพลาดในการดึงข้อมูล
        next(error);
    }
}

exports.readAddress = async (req, res, next) => {
    const addressId = req.params.id; // Get address id from request parameters
    try {
      const address = await Address.findOne({ address_id: addressId });
  
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      return res.status(200).json({ address });
    } catch (error) {
      return next(error);
    }
  };
exports.addAddress = async (req,res,next)=>{
    if (!req.user || !req.user.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      try {
        const address = await db.address.create({
          data: {
            recipient_name: req.body.recipient_name,
            address_line1: req.body.address_line1,
            address_line2: req.body.address_line2,
            postal_code: req.body.postal_code,
            city: req.body.city,
            phone: req.body.phone,
            state: req.body.state,
            user_id: req.user.user_id
          }
        });
        res.status(201).json({ address });
      } catch (error) {
        console.log('Error in addAddress', error);
        return next(new Error('Server error'));
      }
}
exports.updateAddress = async (req, res, next) => {
    const address_id = req.params.id ; 
    try {
      
        if (!req.body.recipient_name || !req.body.address_line1 || !req.body.city || !req.body.postal_code) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedAddress = await db.address.update({
            where: { address_id: parseInt(address_id) }, 
            data: {
                recipient_name: req.body.recipient_name,
                address_line1: req.body.address_line1,
                address_line2: req.body.address_line2 || null,
                city: req.body.city,
                postal_code: req.body.postal_code,
                phone: req.body.phone || null,
                state: req.body.state || null,
                user_id : req.body.userId
            }
        });

     
        res.json({ address: updatedAddress });
    } catch (error) {
        console.log('Error in updateAddress:', error);
        return next(new Error('Server error'));
    }
};

exports.deleteAddress = async (req, res, next) => {
    const { id } = req.params; // Retrieve the address ID from the route parameters
    try {
        // ดำเนินการลบ address จากฐานข้อมูล
        await db.address.delete({
            where: { address_id: parseInt(id) } // ใช้ address ID เพื่อระบุ address ที่ต้องการลบ
        });

        // ตอบกลับด้วยข้อความแสดงว่า address ถูกลบเรียบร้อยแล้ว
        res.status(204).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.log('Error in removeAddress:', error);
        return next(new Error('Server error'));
    }
};