const multer = require('multer');
const sharp = require('sharp');

// กำหนดตำแหน่งที่จะเก็บไฟล์ที่อัปโหลด
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ใหม่โดยเพิ่มเวลาปัจจุบันลงไปเป็นส่วนของชื่อไฟล์
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// กำหนดชนิดของไฟล์ที่ยอมรับ
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

// กำหนดตัวแปร upload เป็น multer middleware
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

module.exports = upload;
