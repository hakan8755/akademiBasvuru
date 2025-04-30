const mongoose = require('mongoose');

const gorevSchema = new mongoose.Schema({
  gorevTuru: String,
  birim: String,
  yili: String,
  puan: Number
}, { _id: false });

const gorevKaydiSchema = new mongoose.Schema({
  gorevler: [gorevSchema],
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gorev', gorevKaydiSchema);
