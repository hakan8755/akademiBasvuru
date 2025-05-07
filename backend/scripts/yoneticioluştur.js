const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/user');

async function createYonetici() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB bağlantısı başarılı');

        const tc = '66666666666';

        // Eski kullanıcı varsa sil
        const deleted = await User.findOneAndDelete({ tc });
        if (deleted) {
            console.log('🗑️ Mevcut kullanıcı silindi:', deleted._id);
        }

        // Yeni yönetici oluştur (password düz, mongoose içinde hashlenecek)
        const newUser = await User.create({
            tc,
            ad: 'jşuri',
            soyad: 'Test',
            dogumYili: 1991,
            password: '1234',
            role: 'juri'
        });

        console.log('🎉 Yönetici başarıyla oluşturuldu:', newUser._id);
        process.exit(0);
    } catch (err) {
        console.error('❌ Hata oluştu:', err);
        process.exit(1);
    }
}

createYonetici();
