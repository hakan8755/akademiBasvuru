const express = require('express');
const router = express.Router();
const Tablo1 = require('../models/Tablo1');

// 🔸 Veri kaydet (formdan gönderim için)
router.post('/', async (req, res) => {
  try {
    const yeniVeri = new Tablo1(req.body);
    await yeniVeri.save();
    res.status(201).json({ message: 'Tablo1 verisi kaydedildi.' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🔸 Son kaydı getir (React tablosuna göstermek için)
router.get('/', async (req, res) => {
  try {
    const veri = await Tablo1.findOne().sort({ createdAt: -1 }); // en son kaydı getir
    if (!veri) return res.status(404).json({ message: 'Veri bulunamadı' });
    res.json(veri);
  } catch (err) {
    console.error('Veri çekme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
