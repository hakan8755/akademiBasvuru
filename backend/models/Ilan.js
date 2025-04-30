// backend/models/Ilan.js
const mongoose = require('mongoose');

/* --- ana şema ------------------------------------------------------- */
const ilanSchema = new mongoose.Schema(
  {
    seviye: {
      type: String,
      enum: ['Dr. Öğr. Üyesi', 'Doçent', 'Profesör'],
      required: true,
    },
    fakultesi: {
      type: String,
      required: true,
    },
    temelAlan: {
      type: String,
      default: '',
    },
    baslangicTarihi: {
      type: Date,
      required: true,
    },
    bitisTarihi: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ilan', ilanSchema);
