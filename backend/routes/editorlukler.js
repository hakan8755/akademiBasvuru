const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Editorluk = require('../models/Editorluk');

router.post('/', async (req, res) => {
  try {
    const { editorlukler, toplamPuan, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const yeniKayit = new Editorluk({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
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
