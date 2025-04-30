const express = require('express');
const router = express.Router();
const Odul = require('../models/Odul');

router.post('/', async (req, res) => {
  try {
    const { oduller, toplamPuan } = req.body;

    const yeniKayit = new Odul({
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
