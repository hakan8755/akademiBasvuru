const express = require('express');
const router = express.Router();
const multer = require('multer');
const Atif = require('../models/Atif');

// Bellekte tut (diskte değil)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { atiflar, atiflarToplamPuan } = req.body;
    const parsed = JSON.parse(atiflar);
    const files = req.files;

    // Her faaliyet nesnesine dosyaları sırayla ekle
    let fileIndex = 0;
    const faaliyetlerWithFiles = parsed.map(f => {
      const attachedFiles = f.files.map(() => {
        const file = files[fileIndex++];
        return {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          buffer: file.buffer
        };
      });
      return { ...f, files: attachedFiles };
    });

    const newDoc = new Atif({
      faaliyetler: faaliyetlerWithFiles,
      atiflarToplamPuan: Number(atiflarToplamPuan)
    });

    await newDoc.save();
    res.status(200).json({ message: 'Atıflar başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
