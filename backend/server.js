require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const auth = require('./routes/auth');
const articleApplicationsRoutes = require('./routes/articleApplication');
const faaliyetRoutes = require('./routes/faaliyet');
const kitapRoutes = require('./routes/kitap');
const atiflarRoutes = require('./routes/atiflar');
const dersvermeRoutes = require('./routes/dersverme');
const tezyonetimiRoutes = require('./routes/tezyonetimi');
const patentlerRoutes = require('./routes/patentler');
const projelerRoutes = require('./routes/projeler');
const editorluklerRoutes = require('./routes/editorlukler');
const odullerRoutes = require('./routes/oduller');
const gorevlerRoutes = require('./routes/gorevler');
const sanatsalfaaliyetlerRoutes = require('./routes/sanatsalfaaliyetler');
const ilanlarRoutes = require('./routes/ilanlar');
const puanTablosuRoutes = require('./routes/puantablosu');
const tablo1Route = require('./routes/tablo1');
const juriRoutes = require('./routes/juri');
const applicationRoutes = require('./routes/applications');


const yoneticiRoutes = require('./routes/yonetici');



const router = express.Router();

// 🔽 Tüm endpointleri buraya ekleyeceksiniz
router.get('/test', (req, res) => {
    res.send('Yönetici endpointi çalışıyor');
});

module.exports = router;


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/yonetici', require('./routes/yonetici'));
app.use('/api/yonetici', yoneticiRoutes);
app.use('/api', auth); // auth için eski rota
app.use('/api/articleApplication', articleApplicationsRoutes); // makale başvuruları için yeni rota
app.use('/api/faaliyet', faaliyetRoutes);
app.use('/api/kitaplar', kitapRoutes);
app.use('/api/atiflar', atiflarRoutes);
app.use('/api/dersverme', dersvermeRoutes);
app.use('/api/tezyonetimi', tezyonetimiRoutes);
app.use('/api/patentler', patentlerRoutes);
app.use('/api/projeler', projelerRoutes);
app.use('/api/editorlukler', editorluklerRoutes);
app.use('/api/oduller', odullerRoutes);
app.use('/api/gorevler', gorevlerRoutes);
app.use('/api/sanatsalfaaliyetler', sanatsalfaaliyetlerRoutes);
app.use('/api/ilanlar', ilanlarRoutes);
app.use('/api/puantablosu', puanTablosuRoutes);
app.use('/api/tablo1', tablo1Route);
app.use('/api/juri', juriRoutes);
app.use('/api/applications', applicationRoutes); // ✅ Bu satır çok önemli!
const adminRoutes = require('./routes/admin');
app.use('/api', adminRoutes); // ✅ admin.js içindeki tüm rotalar /api/users şeklinde olur

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Bağlandı'))
    .catch(err => console.error('MongoDB Hatası', err));

// Server başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend → http://localhost:${PORT}`));
