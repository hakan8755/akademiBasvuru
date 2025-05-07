const express = require('express');
const router = express.Router();
const User = require('../models/User'); // jüri kullanıcıları burada
const JuriAtama = require('../models/JuriAtama'); // eğer varsa, yoksa oluştururuz

// 📌 [GET] /api/juri/adaylar → Sadece role='juri' olan kullanıcıları getir
router.get('/adaylar', async (req, res) => {
  try {
    const juriler = await User.find(
      { role: 'juri' },
      { ad: 1, soyad: 1, tc: 1, _id: 1 }
    );
    res.status(200).json(juriler);
  } catch (err) {
    console.error('Jüri adayları getirme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 📌 [POST] /api/juri/ata → Seçilen jüri üyelerini ilana ata
router.post('/ata', async (req, res) => {
  try {
    const { ilanId, juriUyeleri, atayanYoneticiId } = req.body;

    if (!ilanId || !Array.isArray(juriUyeleri) || juriUyeleri.length < 3) {
      return res.status(400).json({ message: 'Eksik veya geçersiz veri' });
    }

    // İstersen burada daha önce atanmışsa güncelleme yapabilirsin
    const atama = await JuriAtama.findOneAndUpdate(
      { ilanId },
      { ilanId, juriUyeleri, atayanYoneticiId },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Jüri ataması başarıyla kaydedildi', atama });

  } catch (err) {
    console.error('Jüri atama hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
