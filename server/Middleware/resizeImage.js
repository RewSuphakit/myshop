const sharp = require('sharp');

const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const { path } = req.file;

    // ปรับขนาดรูปภาพด้วย sharp
    await sharp(path)
      .resize({ width: 500 }) // ปรับขนาดให้กว้างเป็น 500 พิกเซล
      .toFile(`uploads/resized-${Date.now()}.png`); // เก็บรูปที่ปรับขนาดลงในโฟลเดอร์ uploads และเพิ่มคำว่า resized- นำหน้าชื่อไฟล์เดิม

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = resizeImage;
