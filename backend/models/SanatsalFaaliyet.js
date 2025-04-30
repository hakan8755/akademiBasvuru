const mongoose = require('mongoose');

const faaliyetSchema = new mongoose.Schema({
  faaliyet: String,
  faaliyetAdi: String,
  yili: String,
  puan: Number
}, { _id: false });

const sanatKaydiSchema = new mongoose.Schema({
  faaliyetler: [faaliyetSchema],
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SanatsalFaaliyet', sanatKaydiSchema);
