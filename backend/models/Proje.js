const mongoose = require('mongoose');

const projeSchema = new mongoose.Schema({
  projeTuru: String,
  projeAdi: String,
  projeNo: String,
  kurumAdi: String,
  yili: String,
  puan: Number
}, { _id: false });

const projeKaydiSchema = new mongoose.Schema({
  projeler: [projeSchema],
  toplamPuan1_17: Number,
  toplamPuan1_22: Number,
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proje', projeKaydiSchema);
