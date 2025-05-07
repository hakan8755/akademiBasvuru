const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ArticleApplication = require('../models/ArticleApplication');
const Proje = require('../models/Proje');
const Patent = require('../models/Patent');
const Odul = require('../models/Odul');
const Editorluk = require('../models/Editorluk');
const SanatsalFaaliyet = require('../models/SanatsalFaaliyet');

// 🔎 GET /api/yonetici/ilan-ozet → Her ilana ait özet puanları
router.get('/ilan-ozet', async (req, res) => {
    try {
        const makaleGrup = await ArticleApplication.aggregate([
            {
                $group: {
                    _id: '$ilanId',
                    makaleCount: { $sum: 1 },
                    makalePuan: { $sum: '$toplamPuan' }
                }
            }
        ]);

        async function grupPuan(model, field) {
            const result = await model.aggregate([
                { $group: { _id: '$ilanId', total: { $sum: `$${field}` } } }
            ]);
            const map = {};
            result.forEach(r => map[r._id?.toString()] = r.total);
            return map;
        }

        const projeMap = await grupPuan(Proje, 'toplamPuan');
        const patentMap = await grupPuan(Patent, 'toplamPuan');
        const odulMap = await grupPuan(Odul, 'toplamPuan');
        const editorMap = await grupPuan(Editorluk, 'toplamPuan');
        const sanatMap = await grupPuan(SanatsalFaaliyet, 'toplamPuan');

        const ozet = makaleGrup.map(row => {
            const ilanIdStr = row._id.toString();
            return {
                ilanId: ilanIdStr,
                makaleCount: row.makaleCount,
                makalePuan: row.makalePuan,
                projePuan: projeMap[ilanIdStr] || 0,
                patentPuan: patentMap[ilanIdStr] || 0,
                odulPuan: odulMap[ilanIdStr] || 0,
                editorPuan: editorMap[ilanIdStr] || 0,
                sanatPuan: sanatMap[ilanIdStr] || 0
            };
        });

        res.json(ozet);
    } catch (err) {
        console.error('❌ Özet alma hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// 🔍 GET /api/yonetici/ilan-detay/:ilanId → Belirli ilana ait aday puan özetleri
router.get('/ilan-detay/:ilanId', async (req, res) => {
    const ilanId = req.params.ilanId;

    try {
        const makaleBasvurular = await ArticleApplication.find({ ilanId });
        const userIds = makaleBasvurular.map(b => b.userId.toString());

        const users = await User.find({ _id: { $in: userIds } })
            .select('_id ad soyad tc');

        async function getPuanMap(model, field) {
            const docs = await model.find({ ilanId });
            const map = {};
            docs.forEach(d => {
                const uid = d.userId?.toString();
                if (!uid) return;
                if (!map[uid]) map[uid] = 0;
                map[uid] += d[field] || 0;
            });
            return map;
        }

        const projeMap = await getPuanMap(Proje, 'toplamPuan');
        const patentMap = await getPuanMap(Patent, 'toplamPuan');
        const odulMap = await getPuanMap(Odul, 'toplamPuan');
        const editorMap = await getPuanMap(Editorluk, 'toplamPuan');
        const sanatMap = await getPuanMap(SanatsalFaaliyet, 'toplamPuan');

        const detaylar = users.map(user => {
            const uid = user._id.toString();
            const makale = makaleBasvurular.find(b => b.userId.toString() === uid);
            const makalePuan = makale?.toplamPuan || 0;

            const projePuan = projeMap[uid] || 0;
            const patentPuan = patentMap[uid] || 0;
            const odulPuan = odulMap[uid] || 0;
            const editorPuan = editorMap[uid] || 0;
            const sanatPuan = sanatMap[uid] || 0;

            return {
                userId: uid,
                ad: user.ad,
                soyad: user.soyad,
                tc: user.tc,
                makalePuan,
                projePuan,
                patentPuan,
                odulPuan,
                editorPuan,
                sanatPuan,
                toplam: makalePuan + projePuan + patentPuan + odulPuan + editorPuan + sanatPuan
            };
        });

        res.json(detaylar);
    } catch (err) {
        console.error('❌ Detay hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
// 🔍 GET /api/yonetici/ilan-detay-tum/:ilanId → Adayların tüm verilerini getirir
// 🔍 GET /api/yonetici/ilan-detay-tum/:ilanId
router.get('/ilan-detay-tum/:ilanId', async (req, res) => {
    const ilanId = req.params.ilanId;
    try {
        const userIds = (await ArticleApplication.find({ ilanId })).map(b => b.userId?.toString());
        const users = await User.find({ _id: { $in: userIds } }).select('_id ad soyad tc');

        const userMap = uid => ({ userId: uid, ilanId });

        const [makaleler, kitaplar, projeler, patentler, oduller, editorlukler, sanatsal, gorevler, tezler] = await Promise.all([
            ArticleApplication.find({ ilanId }),
            require('../models/Kitap').find({ ilanId }),
            Proje.find({ ilanId }),
            Patent.find({ ilanId }),
            Odul.find({ ilanId }),
            Editorluk.find({ ilanId }),
            SanatsalFaaliyet.find({ ilanId }),
            require('../models/Gorev').find({ ilanId }),
            require('../models/TezYonetimi').find({ ilanId })
        ]);

        const groupByUser = (list) =>
            list.reduce((acc, item) => {
                const uid = item.userId?.toString();
                if (!uid) return acc;
                if (!acc[uid]) acc[uid] = [];
                acc[uid].push(item.toObject());
                return acc;
            }, {});

        const adaylar = users.map(u => {
            const uid = u._id.toString();
            return {
                userId: uid,
                ad: u.ad,
                soyad: u.soyad,
                tc: u.tc,
                makaleler: groupByUser(makaleler)[uid] || [],
                kitaplar: groupByUser(kitaplar)[uid] || [],
                projeler: groupByUser(projeler)[uid] || [],
                patentler: groupByUser(patentler)[uid] || [],
                oduller: groupByUser(oduller)[uid] || [],
                editorlukler: groupByUser(editorlukler)[uid] || [],
                sanatsal: groupByUser(sanatsal)[uid] || [],
                gorevler: groupByUser(gorevler)[uid] || [],
                tezler: groupByUser(tezler)[uid] || []
            };
        });

        res.json(adaylar);
    } catch (err) {
        console.error('❌ Detay (tüm) hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
