// backend/routes/applications.js
const express = require('express');
const router = express.Router();

// Başvuru başlatma (şimdilik dummy işlem)
router.post('/start', async (req, res) => {
    const { ilanId, userId } = req.body;

    if (!ilanId || !userId) {
        return res.status(400).json({ message: 'ilanId veya userId eksik' });
    }

    console.log('🎯 Başvuru başlatılıyor →', { ilanId, userId });

    // Şimdilik sadece "başarılı" cevabı döndür
    res.status(200).json({ message: 'Başvuru başlatıldı' });
});

module.exports = router;
