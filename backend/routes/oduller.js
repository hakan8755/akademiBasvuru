const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Odul = require('../models/Odul');

router.post('/', async (req, res) => {
  try {
    const { oduller, toplamPuan, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const yeniKayit = new Odul({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      oduller,
      toplamPuan: Number(toplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Ödüller başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Ödül kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
