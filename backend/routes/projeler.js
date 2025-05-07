const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Proje = require('../models/Proje');

router.post('/', async (req, res) => {
  try {
    const {
      projeler,
      toplamPuan1_17,
      toplamPuan1_22,
      toplamPuan,
      userId,
      ilanId
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const yeniKayit = new Proje({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      projeler,
      toplamPuan1_17: Number(toplamPuan1_17),
      toplamPuan1_22: Number(toplamPuan1_22),
      toplamPuan: Number(toplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Araştırma projeleri başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Proje kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
