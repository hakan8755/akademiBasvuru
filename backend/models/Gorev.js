const mongoose = require('mongoose');

const gorevSchema = new mongoose.Schema({
  gorevTuru: String,
  birim: String,
  yili: String,
  puan: Number
}, { _id: false });

const gorevKaydiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ilanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ilan', required: true },
  gorevler: [gorevSchema],
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gorev', gorevKaydiSchema);
