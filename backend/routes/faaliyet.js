// routes/faaliyet.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Faaliyet = require('../models/Faaliyet');

// 🔧 Dosya yükleme ayarları
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

// 📥 Bilimsel Toplantı Faaliyetlerini Kaydet
router.post('/submit', upload.array('files'), async (req, res) => {
  try {
    const { faaliyetler, bolumBToplamPuan, userId } = req.body;
    const parsedFaaliyetler = JSON.parse(faaliyetler);

    // Dosya bilgilerini işle
    const fileInfos = req.files.map(file => ({
      originalName: file.originalname,
      storageName: file.filename,
      path: file.path,
      size: file.size
    }));

    // Dosyaları ilgili faaliyetlere sırayla ata
    let dosyaIndex = 0;
    parsedFaaliyetler.forEach(f => {
      const filesForThis = f.files?.length || 0;
      f.files = fileInfos.slice(dosyaIndex, dosyaIndex + filesForThis);
      dosyaIndex += filesForThis;
    });

    const yeniKayit = new Faaliyet({
      userId,
      faaliyetler: parsedFaaliyetler,
      bolumBToplamPuan
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Bilimsel toplantı faaliyetleri kaydedildi.' });

  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;