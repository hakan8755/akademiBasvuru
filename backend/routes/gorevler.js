const express = require('express');
const router = express.Router();
const Gorev = require('../models/Gorev');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { gorevler, toplamPuan, userId, ilanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ilanId)) {
      return res.status(400).json({ message: 'Geçersiz userId veya ilanId' });
    }

    const yeniKayit = new Gorev({
      userId: new mongoose.Types.ObjectId(userId),
      ilanId: new mongoose.Types.ObjectId(ilanId),
      gorevler,
      toplamPuan: Number(toplamPuan)
    });

    await yeniKayit.save();

    res.status(201).json({
      message: 'Görevler başarıyla tek belge olarak kaydedildi',
      data: yeniKayit
    });

  } catch (error) {
    console.error('Görev kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.get('/', async (req, res) => {
  try {
    const gorevler = await Gorev.find().sort({ submittedAt: -1 });
    res.json(gorevler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
