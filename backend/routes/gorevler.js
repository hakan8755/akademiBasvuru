const express = require('express');
const router = express.Router();
const Gorev = require('../models/Gorev');

// POST → Görevler + toplam puan kayıt
router.post('/', async (req, res) => {
  try {
    const { gorevler, toplamPuan } = req.body;

    // Önce görevleri kaydedelim
    const savedGorevler = await Promise.all(gorevler.map(async (g) => {
      const newGorev = new Gorev({
        gorevTuru: g.gorevTuru,
        birim: g.birim,
        yili: g.yili
      });
      return await newGorev.save();
    }));

    // Ardından toplam puanı ayrı bir belge olarak kaydedelim
    const toplam = new Gorev({
      gorevTuru: "Toplam Puan Kaydı",
      birim: "-",
      yili: new Date().getFullYear().toString(),
      toplamPuan: toplamPuan
    });
    await toplam.save();

    res.status(201).json({
      message: 'Görevler ve toplam puan başarıyla kaydedildi',
      data: {
        gorevler: savedGorevler,
        toplamPuan: toplamPuan
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// GET → Tüm görevler ve toplam puanları listele
router.get('/', async (req, res) => {
  try {
    const gorevler = await Gorev.find().sort({ createdAt: -1 });
    res.json(gorevler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
