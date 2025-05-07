const mongoose = require('mongoose');

const odulSchema = new mongoose.Schema({
  odulTuru: String,
  verenKurum: String,
  yili: String,
  puan: Number
}, { _id: false });

const odulKaydiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ilanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ilan', required: true },
  oduller: [odulSchema],
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Odul', odulKaydiSchema);
