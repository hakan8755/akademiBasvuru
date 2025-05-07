const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    data: { type: Object, default: {} },   // formdaki alanlar
    score: { type: Number, default: 0 },   // o formun puanı
    files: [{                                    // yüklenen dosyalar
        originalName: String,
        storageName: String,
        path: String,
        size: Number
    }]
}, { _id: false });

const applicationSchema = new mongoose.Schema({
    ilanId: { type: Schema.Types.ObjectId, ref: 'Ilan', required: true, index: true }

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['beklemede', 'değerlendiriliyor', 'onaylandı', 'reddedildi'], default: 'beklemede' },

    // Her bir başvuru sayfası için alt alan
    articles: sectionSchema,
    conferences: sectionSchema,
    books: sectionSchema,
    citations: sectionSchema,
    teaching: sectionSchema,
    thesis: sectionSchema,
    patents: sectionSchema,
    researchProjects: sectionSchema,
    journalEditing: sectionSchema,
    achievements: sectionSchema,
    duties: sectionSchema,
    arts: sectionSchema,

    totalScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
