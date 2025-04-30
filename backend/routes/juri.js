const express = require('express');
const router  = express.Router();
const JuriAssignment = require('../models/JuriAssignment');

// 🔹 GET /api/juri/assignments?juriId=...
router.get('/assignments', async (req, res) => {
  try {
    const { juriId } = req.query;
    if (!juriId) return res.status(400).json({ message: 'juriId gerekli' });

    const list = await JuriAssignment
                    .find({ juriId })
                    .populate('ilanId', 'birim seviye fakultesi baslangicTarihi bitisTarihi');
    res.json(list);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🔹 POST /api/juri/assignments  → yeni atama oluşturmak için
router.post('/assignments', async (req, res) => {
  try {
    const { juriId, ilanId } = req.body;
    if (!juriId || !ilanId) return res.status(400).json({ message: 'juriId ve ilanId gerekli' });

    const assignment = await JuriAssignment.create({
      juriId,
      ilanId,
      assignedAt: new Date(),
      status: 'pending'
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🔹 PATCH /api/juri/assignments/:id  → atama durumunu güncellemek için
router.patch('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;  // örn: { status: 'approved' }

    const updated = await JuriAssignment.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Atama bulunamadı' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
