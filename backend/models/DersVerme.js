const mongoose = require('mongoose');

const tekilDersSchema = new mongoose.Schema({
  dersAdi: String,
  programAdi: String,
  donemi: String,
  yili: String
}, { _id: false });

const dersTuruSchema = new mongoose.Schema({
  id: Number,
  dersTuru: String,
  skipped: Boolean,
  dersler: [tekilDersSchema]
}, { _id: false });

const dersVermeSchema = new mongoose.Schema({
  dersler: [dersTuruSchema],
  derslerToplamPuan: Number,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DersVerme', dersVermeSchema);
