const mongoose = require('mongoose');

const faaliyetSchema = new mongoose.Schema({
  id: Number,
  faaliyet: String,
  eser: String,
  atifSayisi: String,
  files: [String]  // Dosya yolları burada tutulacak
}, { _id: false });

const atiflarSchema = new mongoose.Schema({
  faaliyetler: [faaliyetSchema],
  atiflarToplamPuan: Number,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Atif', atiflarSchema);
