const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DersVerme = require('../models/DersVerme');

router.post('/', async (req, res) => {
  try {
    const { dersler, derslerToplamPuan, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz ilanId veya userId' });
    }

    const yeniKayit = new DersVerme({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      dersler,
      derslerToplamPuan: Number(derslerToplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Ders verme bilgileri başarıyla kaydedildi.' });
  } catch (err) {
    console.error('DersVerme kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
