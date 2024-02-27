const fs = require('fs');
const sharp = require('sharp');
const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const { path } = req.file;
    
    const resizedImagePath = `uploads/resized-${Date.now()}.png`;
    await sharp(path)
      .resize({ width: 500 })
      .toFile(resizedImagePath);

      fs.unlinkSync(path, (err) => { // แก้ไขนี้โดยเพิ่ม callback function
      if (err) {
        throw err; // จัดการข้อผิดพลาดในการลบไฟล์
      }
      console.log(`Deleted file: ${path}`);
    });

    return resizedImagePath;
  } catch (error) {
    next(error);
  }
};

module.exports = resizeImage;
