const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Atif = require('../models/Atif');

// Bellekte tut (diskte değil)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { atiflar, atiflarToplamPuan, userId, ilanId } = req.body;

    // ObjectId kontrolü
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const parsed = JSON.parse(atiflar);
    const files = req.files;

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
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
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
