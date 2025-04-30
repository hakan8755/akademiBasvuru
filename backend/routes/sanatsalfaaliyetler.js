const express = require('express');
const router = express.Router();
const SanatsalFaaliyet = require('../models/SanatsalFaaliyet');

router.post('/', async (req, res) => {
  try {
    const { faaliyetler, toplamPuan } = req.body;

    const yeniKayit = new SanatsalFaaliyet({
      faaliyetler: faaliyetler.map(f => ({
        faaliyet: f.faaliyet,
        faaliyetAdi: f.faaliyetAdi,
        yili: f.yili,
        puan: Number(f.puan)
      })),
      toplamPuan: Number(toplamPuan)
    });

    await yeniKayit.save();
    res.status(200).json({ message: 'Sanatsal faaliyetler başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Sanatsal faaliyet kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
