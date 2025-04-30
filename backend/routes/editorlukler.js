const express = require('express');
const router = express.Router();
const Editorluk = require('../models/Editorluk');

router.post('/', async (req, res) => {
  try {
    const { editorlukler, toplamPuan } = req.body;

    const yeniKayit = new Editorluk({
      editorlukler,
      toplamPuan: Number(toplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Editörlük ve hakemlik bilgileri kaydedildi.' });
  } catch (err) {
    console.error('Editorluk kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
