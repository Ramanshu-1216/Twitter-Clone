const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User');
const tweetSchema = new mongoose.Schema({
  created_at: { type: Date },
  text: { type: String, required: true },
  imgURL: { type: String, required: false },
  userId: { type: String, required: true },
  user: {},
  likes: {type: Array}
});

tweetSchema.pre('save', async function (next) {
    try{
        const saveDoc = this;
        const user = await User.findOne({ _id: this.userId }).select(['-password', '-token']);;
        if(user){
            user.tweets.push(this._id.toString());
            await user.save();
            this.user = user;
            saveDoc.userData = { user: user };
            next();
        }
        else{
            next("User not found");
        }
    }
    catch (error){
        next(error);
    }
});


const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
