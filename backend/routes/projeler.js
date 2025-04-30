const express = require('express');
const router = express.Router();
const Proje = require('../models/Proje');

router.post('/', async (req, res) => {
  try {
    const {
      projeler,
      toplamPuan1_17,
      toplamPuan1_22,
      toplamPuan
    } = req.body;

    const yeniKayit = new Proje({
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
