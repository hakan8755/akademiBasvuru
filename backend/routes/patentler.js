const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Patent = require('../models/Patent');

router.post('/', async (req, res) => {
  try {
    const { patentler, toplamPuan, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const yeniKayit = new Patent({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      patentler,
      toplamPuan: parseFloat(toplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Patent başvurusu kaydedildi.' });
  } catch (err) {
    console.error('Patent kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;
