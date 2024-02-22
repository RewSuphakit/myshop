// resizeImage.js
const sharp = require('sharp');
const fs = require('fs');

const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const { path } = req.file;
    
    // ปรับขนาดรูปภาพด้วย sharp
    const resizedImagePath = `uploads/resized-${Date.now()}.png`;
    await sharp(path)
      .resize({ width: 500 }) // ปรับขนาดให้กว้างเป็น 500 พิกเซล
      .toFile(resizedImagePath); // เก็บรูปที่ปรับขนาดลงในโฟลเดอร์ uploads และเพิ่มคำว่า resized- นำหน้าชื่อไฟล์เดิม

    // ลบไฟล์ที่อัปโหลด
    fs.unlinkSync(path);

    // ส่งเส้นทางของรูปที่ถูกปรับขนาดกลับ
    return resizedImagePath;
  } catch (error) {
    next(error);
  }
};

module.exports = resizeImage;
