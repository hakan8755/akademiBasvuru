// models/Kitap.js
const mongoose = require('mongoose');

const kitapSchema = new mongoose.Schema({
  id: Number,
  tip: String,
  skipped: { type: Boolean, default: false },
  authors: String,
  bookTitle: String,
  publisher: String,
  edition: String,
  location: String,
  year: String,
  authorCount: Number,
  files: [
    {
      originalName: String,
      storageName: String,
      path: String,
      size: Number
    }
  ]
}, { _id: false });

const kitapKaydiSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  kitaplar: [kitapSchema],
  kitaplarToplamPuan: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kitap', kitapKaydiSchema);