const multer = require("multer");

// Konfiguro memory storage per foto
const storage = multer.memoryStorage();

// File filter - vetem foto jane te lejuara
const fotoFilter = (req, file, cb) => {
  const llojetELejuara = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (llojetELejuara.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Vetem foto jane te lejuara (JPEG, PNG, WEBP, GIF)!"), false);
  }
};

// Kufiri i madhesise: 5MB
const limits = {
  fileSize: 5 * 1024 * 1024,
};

// Krijo dhe konfiguro multer per ngarkimin e fotove
const uploadFoto = multer({
  storage: storage,
  fileFilter: fotoFilter,
  limits: limits,
});

module.exports = uploadFoto;
