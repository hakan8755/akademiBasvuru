const router = require('express').Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;  // ← BU SATIR OLMALI!
