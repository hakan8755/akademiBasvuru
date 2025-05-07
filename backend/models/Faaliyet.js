// backend/models/Faaliyet.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Dosya şeması */
const fileSchema = new Schema({
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

/* Tekil faaliyet satırı */
const faaliyetSchema = new Schema({
  id: { type: Number, required: true },
  tip: { type: String, required: true },
  skipped: { type: Boolean, default: false },
  authors: { type: String },
  title: { type: String },
  conferenceName: { type: String },
  location: { type: String },
  pages: { type: String },
  date: { type: String },
  authorCount: { type: Number, default: 1 },
  files: { type: [fileSchema], default: [] }
}, { _id: false });

/* Ana belge */
const bilimselFaaliyetSchema = new Schema({
  ilanId: { type: Schema.Types.ObjectId, ref: 'Ilan', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },


  faaliyetler: { type: [faaliyetSchema], required: true },
  bolumBToplamPuan: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

/* Aynı kullanıcı aynı ilana ikinci kez başvuramasın */
bilimselFaaliyetSchema.index({ userId: 1, ilanId: 1 }, { unique: true });

module.exports = mongoose.model('Faaliyet', bilimselFaaliyetSchema);
