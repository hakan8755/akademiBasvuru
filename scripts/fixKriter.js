require('dotenv').config();
const mongoose = require('mongoose');
const Ilan = require('./models/Ilan');    // yolunuza göre ayarlayın

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const res = await Ilan.updateMany(
    { $or: [{ kriter: { $exists: false } }, { kriter: null }] },
    { $set: { kriter: { minMakale:0, toplamPuan:0, a1Zorunlu:false, tabloReferansi:'' } } }
  );

  console.log(`${res.modifiedCount} eski kayıt güncellendi ✅`);
  await mongoose.disconnect();
})();
