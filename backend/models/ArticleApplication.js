// backend/models/ArticleApplication.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* -------------------------------------------------
 *  Alt şemalar
 * -------------------------------------------------*/

// ⬥ Yüklenen dosyalar
const fileSchema = new Schema({
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

// ⬥ Her makale satırı
const articleSchema = new Schema({
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

/* -------------------------------------------------
 *  Ana şema
 * -------------------------------------------------*/

const articleApplicationSchema = new Schema({
  /* İlan ve kullanıcı ilişkilendirmesi */
  ilanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ilan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  articles: { type: [articleSchema], required: true },
  toplamPuan1_4: { type: Number, required: true },
  toplamPuan1_5: { type: Number, required: true },
  toplamPuan1_6: { type: Number, required: true },
  toplamPuan1_8: { type: Number, required: true },
  toplamPuan: { type: Number, required: true },

  /* Dosyalar */
  uploadedFiles: { type: [fileSchema], default: [] }
}, { timestamps: true });

/* Aynı kullanıcı aynı ilana ikinci kez başvuramasın */
articleApplicationSchema.index({ ilanId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ArticleApplication', articleApplicationSchema);
