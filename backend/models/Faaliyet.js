// models/Faaliyet.js
const mongoose = require('mongoose');

const faaliyetSchema = new mongoose.Schema({
  id: Number,
  tip: String,
  skipped: { type: Boolean, default: false },
  authors: String,
  title: String,
  conferenceName: String,
  location: String,
  pages: String,
  date: String,
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

const bilimselFaaliyetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  faaliyetler: [faaliyetSchema],
  bolumBToplamPuan: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faaliyet', bilimselFaaliyetSchema);