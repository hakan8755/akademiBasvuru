const express = require('express');
const router = express.Router();

const ArticleApplication = require('../models/ArticleApplication');
const Atif = require('../models/Atif');
const DersVerme = require('../models/DersVerme');
const Editorluk = require('../models/Editorluk');
const Faaliyet = require('../models/Faaliyet');
const Gorev = require('../models/Gorev');
const Kitap = require('../models/Kitap');
const Odul = require('../models/Odul');
const Patent = require('../models/Patent');
const Proje = require('../models/Proje');
const SanatsalFaaliyet = require('../models/SanatsalFaaliyet');
const TezYonetimi = require('../models/TezYonetimi');

router.get('/', async (req, res) => {
  try {
    const getLatest = async (Model) => await Model.findOne().sort({ _id: -1 });

    const [
      article, atif, ders, editorluk, faaliyet, gorev, kitap,
      odul, patent, proje, sanat, tez
    ] = await Promise.all([
      getLatest(ArticleApplication),
      getLatest(Atif),
      getLatest(DersVerme),
      getLatest(Editorluk),
      getLatest(Faaliyet),
      getLatest(Gorev),
      getLatest(Kitap),
      getLatest(Odul),
      getLatest(Patent),
      getLatest(Proje),
      getLatest(SanatsalFaaliyet),
      getLatest(TezYonetimi)
    ]);

    const puanlar = {
      articleApplication: {
        toplamPuan: article?.toplamPuan || 0,
        toplamPuan1_4: article?.toplamPuan1_4 || 0,
        toplamPuan1_5: article?.toplamPuan1_5 || 0,
        toplamPuan1_6: article?.toplamPuan1_6 || 0,
        toplamPuan1_8: article?.toplamPuan1_8 || 0,
      },
      atif: atif?.atiflarToplamPuan || 0,
      dersVerme: ders?.derslerToplamPuan || 0,
      tezYonetimi: tez?.tezlerToplamPuan || 0,
      patent: patent?.toplamPuan || 0,
      proje: {
        toplam1_17: proje?.toplamPuan1_17 || 0,
        toplam1_22: proje?.toplamPuan1_22 || 0,
        genelToplam: proje?.toplamPuan || 0
      },
      editorluk: editorluk?.toplamPuan || 0,
      odul: odul?.toplamPuan || 0,
      gorev: gorev?.toplamPuan || 0,
      sanat: sanat?.toplamPuan || 0,
      bilimselToplanti: faaliyet?.bolumBToplamPuan || 0,
      kitap: kitap?.kitaplarToplamPuan || 0
    };

    const genelToplam = 
      puanlar.articleApplication.toplamPuan +
      puanlar.atif +
      puanlar.dersVerme +
      puanlar.tezYonetimi +
      puanlar.patent +
      puanlar.proje.genelToplam +
      puanlar.editorluk +
      puanlar.odul +
      puanlar.gorev +
      puanlar.sanat +
      puanlar.bilimselToplanti +
      puanlar.kitap;

    res.status(200).json({ puanlar, genelToplam });
  } catch (err) {
    console.error('Puanları toplarken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
