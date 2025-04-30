// models/articleApplication.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleTypeId: { type: Number, required: true },
  articleTypeName: { type: String, required: true },
  skipped: { type: Boolean, default: false },
  isMainAuthor: { type: Boolean, default: null },
  isResponsibleAuthor: { type: Boolean, default: null },
  isEqualContribution: { type: Boolean, default: null },
  hasExternalAuthor: { type: Boolean, default: null },
  isReview: { type: Boolean, default: null },
  authorCount: { type: Number, default: 1 },
  articleDetails: {
    authors: { type: String, default: null },
    articleTitle: { type: String, default: null },
    journalName: { type: String, default: null },
    volume: { type: String, default: null },
    pages: { type: String, default: null },
    year: { type: Number, default: null }
  }
}, { _id: false });

const articleApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  articles: [articleSchema],
  toplamPuan1_4: { type: Number, required: true },
  toplamPuan1_5: { type: Number, required: true },
  toplamPuan1_6: { type: Number, required: true },
  toplamPuan1_8: { type: Number, required: true },
  toplamPuan:    { type: Number, required: true },
  uploadedFiles: [{
    originalName: String,
    storageName: String,
    path: String,
    size: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('ArticleApplication', articleApplicationSchema);