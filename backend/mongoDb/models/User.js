const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date },
  token: { type: String },
  followers: { type: Array },
  following: { type: Array },
  tweets: { type: Array },
  username: {type: String, required: true, unique: true}
});

userSchema.pre('save', async function (next) {
  try {
    if(!this.token){
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
