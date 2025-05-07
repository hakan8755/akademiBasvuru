const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  ilanId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Ilan', required: true },
  juriId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  durum:      { type: String, enum: ['beklemede', 'onaylandı', 'reddedildi'], default: 'beklemede' },
  notlar:     String,
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('JuriAssignment', assignmentSchema);
