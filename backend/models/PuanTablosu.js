const mongoose = require('mongoose');

const puanTablosuSchema = new mongoose.Schema({
  puanlar: {
    makale: Number,
    atif: Number,
    dersVerme: Number,
    tezYonetimi: Number,
    patent: Number,
    proje: {
      genelToplam: Number,
      toplam1_17: Number,
      toplam1_22: Number
    },
    editorluk: Number,
    odul: Number,
    gorev: Number,
    sanat: Number,
    bilimselToplanti: Number
  },
  genelToplam: Number,
  olusturulmaTarihi: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PuanTablosu', puanTablosuSchema);
