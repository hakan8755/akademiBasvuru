// routes/patentler.js
const express = require('express');
const router = express.Router();
const Patent = require('../models/Patent');

// POST /api/patentler
router.post('/', async (req, res) => {
  try {
    const { patentler, toplamPuan, userId } = req.body;

    const yeniKayit = new Patent({
      userId,
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
