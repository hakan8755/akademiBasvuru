// backend/models/JuriAtama.js
const mongoose = require('mongoose');

const juriAtamaSchema = new mongoose.Schema({
    ilanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ilan', required: true },
    juriUyeleri: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            ad: String,
            soyad: String,
            tc: String
        }
    ],
    atayanYoneticiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('JuriAtama', juriAtamaSchema);
