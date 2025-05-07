const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const TezYonetimi = require('../models/TezYonetimi');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { tezler, tezlerToplamPuan, 'f1-f2': f1_f2_Toplam, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const parsedTezler = JSON.parse(tezler);
    const uploadedFiles = req.files;

    let fileIndex = 0;
    const tezlerWithFiles = parsedTezler.map(t => {
      const dosyalar = t.files.map(() => {
        const file = uploadedFiles[fileIndex++];
        return {
          originalName: file.originalname,
          storageName: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        };
      });
      return { ...t, uploadedFiles: dosyalar };
    });

    const yeniKayit = new TezYonetimi({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      tezler: tezlerWithFiles,
      tezlerToplamPuan: Number(tezlerToplamPuan),
      f1_f2_Toplam: Number(f1_f2_Toplam)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Tez yönetimi başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Tez yönetimi kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
