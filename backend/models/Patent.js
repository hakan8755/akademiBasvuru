// models/Patent.js
const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  id: Number,
  patentTuru: String,
  skipped: { type: Boolean, default: false },
  patentAdi: String,
  yili: String,
  authorCount: Number
}, { _id: false });

const patentKaydiSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patentler: [patentSchema],
  toplamPuan: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patent', patentKaydiSchema);
