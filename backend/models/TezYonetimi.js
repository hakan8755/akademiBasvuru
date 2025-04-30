const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  originalName: String,
  storageName: String,
  path: String,
  size: Number,
  mimetype: String
}, { _id: false });

const tezSchema = new mongoose.Schema({
  id: Number,
  tezTuru: String,
  ogrenciAdi: String,
  tezAdi: String,
  enstitusu: String,
  yili: String,
  skipped: Boolean,
  uploadedFiles: [uploadedFileSchema]
}, { _id: false });

const tezYonetimiSchema = new mongoose.Schema({
  tezler: [tezSchema],
  tezlerToplamPuan: Number,
  f1_f2_Toplam: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TezYonetimi', tezYonetimiSchema);
