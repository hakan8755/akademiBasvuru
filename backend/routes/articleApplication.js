const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ArticleApplication = require('../models/ArticleApplication');

// 🔧 Multer ayarları
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

// 📥 Başvuru kaydetme
router.post('/submit', upload.array('files'), async (req, res) => {
  try {
    const {
      articles,
      toplamPuan1_4,
      toplamPuan1_5,
      toplamPuan1_6,
      toplamPuan1_8,
      toplamPuan,
      userId
    } = req.body;

    const parsedArticles = JSON.parse(articles);

    const filePaths = req.files.map(file => ({
      originalName: file.originalname,
      storageName: file.filename,
      path: file.path,
      size: file.size
    }));

    const newApplication = new ArticleApplication({
      userId,
      articles: parsedArticles,
      toplamPuan1_4,
      toplamPuan1_5,
      toplamPuan1_6,
      toplamPuan1_8,
      toplamPuan,
      uploadedFiles: filePaths
    });

    await newApplication.save();
    res.status(200).json({ message: 'Başvuru başarıyla kaydedildi.' });

  } catch (err) {
    console.error('Başvuru kaydetme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;