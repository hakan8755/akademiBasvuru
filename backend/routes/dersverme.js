const express = require('express');
const router = express.Router();
const DersVerme = require('../models/DersVerme');

router.post('/', async (req, res) => {
  try {
    const { dersler, derslerToplamPuan } = req.body;

    const yeniKayit = new DersVerme({
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
