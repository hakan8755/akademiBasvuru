const mongoose = require('mongoose');

const editorlukSchema = new mongoose.Schema({
  gorevTuru: String,
  dergiAdi: String,
  sayisi: Number,
  yili: String,
  puan: Number
}, { _id: false });

const editorlukKaydiSchema = new mongoose.Schema({
  editorlukler: [editorlukSchema],
  toplamPuan: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Editorluk', editorlukKaydiSchema);
