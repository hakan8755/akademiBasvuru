// routes/kitap.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Kitap = require('../models/Kitap');

// Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Kitap başvurusu kaydet
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { kitaplar, kitaplarToplamPuan, userId } = req.body;
    const parsedKitaplar = JSON.parse(kitaplar);

    const fileInfos = req.files.map(file => ({
      originalName: file.originalname,
      storageName: file.filename,
      path: file.path,
      size: file.size
    }));

    let fileIndex = 0;
    parsedKitaplar.forEach(k => {
      const fileCount = k.files?.length || 0;
      k.files = fileInfos.slice(fileIndex, fileIndex + fileCount);
      fileIndex += fileCount;
    });

    const yeniKayit = new Kitap({
      userId,
      kitaplar: parsedKitaplar,
      kitaplarToplamPuan: parseFloat(kitaplarToplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Kitap başvurusu kaydedildi.' });
  } catch (err) {
    console.error('Kitap kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;
