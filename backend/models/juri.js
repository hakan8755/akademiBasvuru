// models/Juri.js
const mongoose = require('mongoose');

const juriSchema = new mongoose.Schema({
    ilanId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ilan' },
    juriUyeleri: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            ad: String,
            soyad: String,
            tc: String
        }
    ],
    atayanYoneticiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Juri', juriSchema);
