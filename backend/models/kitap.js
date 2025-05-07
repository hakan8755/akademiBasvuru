// backend/models/Kitap.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Dosya yapısı */
const fileSchema = new Schema({
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

/* Kitap satırı */
const kitapSchema = new Schema({
  id: { type: Number, required: true },
  tip: { type: String, required: true },
  skipped: { type: Boolean, default: false },
  authors: { type: String },
  bookTitle: { type: String },
  publisher: { type: String },
  edition: { type: String },
  location: { type: String },
  year: { type: String },
  authorCount: { type: Number, default: 1 },
  files: { type: [fileSchema], default: [] }
}, { _id: false });

/* Ana belge */
const kitapKaydiSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ilanId: { type: Schema.Types.ObjectId, ref: 'Ilan', required: true, index: true },

  kitaplar: { type: [kitapSchema], required: true },
  kitaplarToplamPuan: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

/* Aynı kullanıcı aynı ilana ikinci kez başvuramasın */
kitapKaydiSchema.index({ userId: 1, ilanId: 1 }, { unique: true });

module.exports = mongoose.model('Kitap', kitapKaydiSchema);
