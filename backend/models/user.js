const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  tc:        { type: String, required: true, unique: true, length: 11 },
  ad:        { type: String, required: true },
  soyad:     { type: String, required: true },
  dogumYili: { type: Number, required: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['aday','juri','yonetici','admin'], default: 'aday' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compare = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);
