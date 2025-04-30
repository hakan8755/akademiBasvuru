const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const soap = require('soap');
const User = require('../models/User');

// ✅ TC Kimlik doğrulama (gerçek servis)
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
    console.log('📡 Doğrulama sonucu API’den geldi:', result?.TCKimlikNoDogrulaResult);
    return result?.TCKimlikNoDogrulaResult === true;
  } catch (err) {
    console.error('❌ SOAP API HATASI:', err.message);
    return false;
  }
}

// ✅ Manuel test için
router.post('/dogrula', async (req, res) => {
  const { tc, ad, soyad, dogumYili } = req.body;
  try {
    const valid = await verifyTCKimlik({ tc, ad, soyad, dogumYili });
    res.json({ valid });
  } catch (e) {
    res.status(500).json({ message: 'Kimlik servisi hatası' });
  }
});

// ✅ Aday kayıt
router.post('/register', async (req, res) => {
  const { tc, ad, soyad, dogumYili, password } = req.body;
  console.log('🔔 Yeni kayıt isteği:', tc, ad, soyad, dogumYili);

  const isValid = await verifyTCKimlik({ tc, ad, soyad, dogumYili });
  console.log('✅ verifyTCKimlik sonucu:', isValid);

  if (isValid !== true) {
    console.log('⛔ Kimlik doğrulanamadı, kayıt engellendi.');
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
      role: 'aday'
    });

    console.log('✅ Kayıt başarılı:', user._id);
    res.status(201).json({ message: 'Kayıt başarılı', id: user._id });
  } catch (e) {
    console.error('❌ Kayıt hatası:', e);
    res.status(500).json({ message: 'Kayıt sırasında sunucu hatası oluştu.' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { tc, password, role } = req.body;

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
        ad: user.ad,
        soyad: user.soyad
      }
    });
  } catch (err) {
    console.error('❌ Giriş hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;