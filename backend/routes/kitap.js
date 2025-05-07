// backend/routes/kitap.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Kitap = require('../models/Kitap');

// 🔧 Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.exname(file.originalname));
  }
});
const upload = multer({ storage });

/* Kitap başvurusunu kaydet */
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { kitaplar, kitaplarToplamPuan, userId, ilanId } = req.body;

    if (!userId || !ilanId) {
      return res.status(400).json({ message: 'userId ve ilanId zorunludur.' });
    }

    const parsed = JSON.parse(kitaplar);

    const fileInfos = req.files.map(file => ({
      originalName: file.originalname,
      storageName: file.filename,
      path: file.path,
      size: file.size
    }));

    let dosyaIndex = 0;
    parsed.forEach(k => {
      const fileCount = k.files?.length || 0;
      k.files = fileInfos.slice(dosyaIndex, dosyaIndex + fileCount);
      dosyaIndex += fileCount;
    });

    const yeni = new Kitap({
      userId,
      ilanId,
      kitaplar: parsed,
      kitaplarToplamPuan: parseFloat(kitaplarToplamPuan)
    });

    await yeni.save();
    res.status(200).json({ message: 'Kitap başvurusu kaydedildi.' });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Bu ilana zaten başvurdunuz.' });
    }
    console.error('Kitap kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;
