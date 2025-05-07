const express = require('express');
const router = express.Router();
const SanatsalFaaliyet = require('../models/SanatsalFaaliyet');

router.post('/', async (req, res) => {
  try {
    const { faaliyetler, toplamPuan, userId, ilanId } = req.body;

    if (!userId || !ilanId) {
      return res.status(400).json({ message: 'userId ve ilanId zorunludur.' });
    }

    const yeniKayit = new SanatsalFaaliyet({
      userId,
      ilanId,
      faaliyetler,
      toplamPuan: Number(toplamPuan)
    });
    console.log('➡️ Gelen ilanId:', req.body.ilanId);

    await yeniKayit.save();
    res.status(200).json({ message: 'Sanatsal faaliyet kaydı başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('Sanatsal faaliyet kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;
