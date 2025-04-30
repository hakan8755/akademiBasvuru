const mongoose = require('mongoose');

const tablo1Schema = new mongoose.Schema({
  toplamA1_A2: Number,
  toplamA1_A4: Number,
  toplamA1_A5: Number,
  toplamA1_A6: Number,
  toplamA1_A8: Number,
  baslicaYazarSayisi: Number,
  toplamMakaleSayisi: Number,
  kisiselKarmaEtkinlikSayisi: Number,
  bolumF_Sayisi: Number,
  toplamPuan1_17: Number,
  toplamPuan1_22: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Tablo1', tablo1Schema);
