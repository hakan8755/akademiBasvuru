const evalSchema = new mongoose.Schema({
    applicationId : { type: mongoose.Schema.Types.ObjectId, ref:'ArticleApplication', required:true },
    jurorId       : { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
    score         : Number,
    comment       : String,
    submittedAt   : { type: Date, default: Date.now }
  });
  module.exports = mongoose.model('Evaluation', evalSchema);
  