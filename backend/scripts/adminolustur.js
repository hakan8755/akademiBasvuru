const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB bağlantısı başarılı');

        const tc = '33333333333';

        // Eski admin varsa sil
        const deleted = await User.findOneAndDelete({ tc });
        if (deleted) {
            console.log('🗑️ Mevcut admin silindi:', deleted._id);
        }

        // Yeni admin oluştur (şifre düz yazılır, schema hashleyecek)
        const newUser = await User.create({
            tc,
            ad: 'Admin',
            soyad: 'Sistem',
            dogumYili: 1985,
            password: '1234',
            role: 'admin'
        });

        console.log('🎉 Admin başarıyla oluşturuldu:', newUser._id);
        process.exit(0);
    } catch (err) {
        console.error('❌ Hata oluştu:', err);
        process.exit(1);
    }
}

createAdmin();
