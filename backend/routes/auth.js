const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const soap = require('soap');
const User = require('../models/User');

// ✅ Gerçek TC Kimlik Doğrulama
async function verifyTCKimlik({ tc, ad, soyad, dogumYili }) {
  const url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
  const args = {
    TCKimlikNo: tc,
    Ad: ad.trim().toUpperCase(),
    Soyad: soyad.trim().toUpperCase(),
    DogumYili: parseInt(dogumYili)
  };

  try {
    const client = await soap.createClientAsync(url);
    const [result] = await client.TCKimlikNoDogrulaAsync(args);
    console.log('📡 TC Doğrulama sonucu:', result?.TCKimlikNoDogrulaResult);
    return result?.TCKimlikNoDogrulaResult === true;
  } catch (err) {
    console.error('❌ SOAP API HATASI:', err.message);
    return false;
  }
}

// ✅ TC Kimlik Test Endpoint (opsiyonel)
router.post('/dogrula', async (req, res) => {
  const { tc, ad, soyad, dogumYili } = req.body;
  try {
    const valid = await verifyTCKimlik({ tc, ad, soyad, dogumYili });
    res.json({ valid });
  } catch (e) {
    res.status(500).json({ message: 'Kimlik servisi hatası' });
  }
});

// ✅ Aday Kayıt
router.post('/register', async (req, res) => {
  const { tc, ad, soyad, dogumYili, password } = req.body;
  console.log('🔔 Kayıt talebi:', tc, ad, soyad);

  const isValid = await verifyTCKimlik({ tc, ad, soyad, dogumYili });
  if (!isValid) {
    return res.status(400).json({ message: 'T.C. Kimlik doğrulaması başarısız.' });
  }

  try {
    const existing = await User.findOne({ tc });
    if (existing) {
      return res.status(409).json({ message: 'Zaten kayıtlı' });
    }

    const user = await User.create({
      tc,
      ad,
      soyad,
      dogumYili,
      password,
      role: 'aday' // Sadece aday kayıt olabilir
    });

    res.status(201).json({ message: 'Kayıt başarılı', id: user._id });
  } catch (err) {
    console.error('❌ Kayıt Hatası:', err);
    res.status(500).json({ message: 'Kayıt sırasında sunucu hatası oluştu.' });
  }
});

// ✅ Tüm Rollere Giriş (aday, admin, jüri, yönetici)
router.post('/login', async (req, res) => {
  const { tc, password, role } = req.body;

  if (!tc || !password || !role) {
    return res.status(400).json({ message: 'Eksik giriş bilgisi' });
  }

  try {
    const user = await User.findOne({ tc, role });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await user.compare(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Şifre yanlış.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'gizliAnahtar',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        tc: user.tc,
        ad: user.ad,
        soyad: user.soyad,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Giriş hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
