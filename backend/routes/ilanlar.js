// backend/routes/ilanlar.js
const express = require('express');
const Ilan = require('../models/Ilan');
const router = express.Router();

// GET  /api/ilanlar  ► Tüm ilanları getir (gerekli alanlar + sıralı)
router.get('/', async (_, res) => {
  try {
    const list = await Ilan.find({}, {
      seviye: 1,
      fakultesi: 1,
      temelAlan: 1,
      baslangicTarihi: 1,
      bitisTarihi: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// POST /api/ilanlar ► Yeni ilan ekler
router.post('/', async (req, res) => {
  try {
    const { seviye, fakultesi, baslangicTarihi, bitisTarihi } = req.body;

    // Basit zorunlu alan kontrolü
    if (!seviye || !fakultesi || !baslangicTarihi || !bitisTarihi) {
      return res.status(400).json({ message: 'Lütfen gerekli alanları doldurun.' });
    }

    const yeni = await Ilan.create(req.body);
    res.status(201).json(yeni);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Kayıt hatası', error: e.message });
  }
});

// DELETE /api/ilanlar/:id ► İlanı siler
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Ilan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    res.json({ message: 'İlan silindi', id: deleted._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
