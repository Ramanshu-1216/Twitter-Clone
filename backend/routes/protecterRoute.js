const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../mongoDb/models/User');
const Tweet = require('../mongoDb/models/Tweet');

router.get('/user/all', authMiddleware, async (req, res) => {
  const u = await User.findOne({_id: req.userData.userId});
  const users = await User.find({_id: {$ne: req.userData.userId}}).select(['-password', '-token']);
  if(!users){
    res.status(500).json({error: "Internal Server Error"});
  }
  else{
    let following = [];
    let notFollowing = [];
    console.log(u);
    users.forEach((user) => {
      console.log(u.following.includes(user.id));
      if(u.following.includes(user.id)){
        following.push(user);
      }
      else if(user.id != req.userData.userId){
        notFollowing.push(user);
      }
    })
    res.status(200).json({user: u, following, notFollowing});
  }
});
router.post('/user/myTweets', authMiddleware, async (req, res) => {
  const id = req.body.id;
  try {
    const users = await User.find({_id: id}).select(['-token', '-password']);
    if(!users){
      res.status(500).json({error: "Internal Server Error"});
    }
    else{
      const tweets = await Tweet.find({ _id: {$in: users[0].tweets}});
      console.log(tweets);
      if(tweets){
        for(let i = 0; i < tweets.length; i++){
          tweets[i].user = users[0];
        }
        res.status(200).json(tweets);
      }
      else{
        res.status(200).json("Not tweeted yet!");
      }
    }
  }
  catch (error){
    res.status(500).json({error: "Internal Server Error"});
  }
});
router.get('/user/timeline', authMiddleware, async (req, res) => {
  try{
    const users = await User.find({_id: req.userData.userId}).select(['following']);
    if(!users){
      res.status(500).json({error: "Internal Server Error"});
    }
    else{
      const tweets = await Tweet.find({$or: [{userId: {$in: users[0].following}}, {userId: req.userData.userId}]}).sort({created_at: -1});
      for(let i = 0; i < tweets.length; i++){
        const user = await User.findOne({_id: tweets[i].userId}).select(['-password', '-token']);
        tweets[i].user = user;
        console.log(user, tweets[i]);
      }
      if(tweets){
        res.status(200).json(tweets);
      }
      else{
        res.status(200).json("");
      }
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
router.post('/user/follow', authMiddleware, async (req, res) => {
  const id = req.body.id;
  console.log(req.body)
  try{
    if(!id){
      res.status(401).json({error: "Provide id of user to follow"});
    }
    else{
      const user = await User.findOne({_id: req.userData.userId});
      if(!user){
        res.status(500).json({error: "Internal Server Error"});
      }
      else{
        const followUser = await User.findOne({_id: id});
        if(!followUser){
          res.status(401).json({error: "Invalid user to folllow"});
        }
        else{
          if(!user.following.includes(id)){
            user.following.push(followUser._id.toString());
            followUser.followers.push(req.userData.userId);
            await followUser.save();
            await user.save();
            res.status(200).json("Followed");
          }
          else{
            res.status(200).json("User already followed");
          }
        }
      }
    }
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
router.post('/user/unfollow', authMiddleware, async (req, res) => {
  const id = req.body.id;
  try{
    if(!id){
      res.status(401).json({error: "Provide id of user to unfollow"});
    }
    else{
      const user = await User.findOne({_id: req.userData.userId});
      if(!user){
        res.status(500).json({error: "Internal Server Error"});
      }
      else{
        const followUser = await User.findOne({_id: id});
        if(!followUser){
          res.status(401).json({error: "Invalid user to unfolllow"});
        }
        else{
          if(user.following.includes(id)){
            user.following = user.following.filter(item => item != followUser._id.toString());
            followUser.followers = followUser.followers.filter(item => item != req.userData.userId);
            await user.save();
            await followUser.save();
            res.status(200).json("Unfollowed");
          }
          else{
            res.status(200).json("User not followed");
          }
        }
      }
    }
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.post('/user/newTweet', authMiddleware, async (req,  res) => {
  try {
    const { text, imgURL } = req.body;
    if(!text) res.status(401).json({error: "Send text"});
    else{
      const tweet = new Tweet({
        text,
        imgURL,
        userId: req.userData.userId,
        created_at: new Date(),
      });
      const user = await tweet.save();
      res.status(200).json({message: "Tweeted successfully", post: tweet});
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.delete('/user/deleteTweet', authMiddleware, async (req, res) => {
  try{
    const tweetId = req.body.tweetId;
    if(!tweetId) res.status(401).json("Send tweetId");
    const user = await User.findOne({_id: req.userData.userId});
    if(user.tweets.includes(tweetId)){
      const tweet = await Tweet.deleteOne({_id: tweetId});
      user.tweets = user.tweets.filter(item => item != tweetId);
      await user.save();
      res.status(200).json("Deleted");
    }
    else{
      res.status(401).json("Not belong to users");
    }
  }
  catch(error){
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.post('/user/tweet/edit', authMiddleware, async (req, res) => {
  try{
    const tweetId = req.body.tweetId;
    const { text, imageURL} = req.body;
    if(!tweetId) res.status(400).json("Send tweetId");
    if(!text && !imageURL) res.status(401).json("Send text or imageURL");
    const tweet = await Tweet.findOne({_id: tweetId});
    console.log(tweet);
    if(text){
      tweet.text = text;
    }
    if(imageURL){
      tweet.imageURL = imageURL;
    }
    await tweet.save();
    res.status(200).json("tweet updated");
  }
  catch (error){
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.post('/user/tweet/like', authMiddleware, async (req, res) => {
  const tweetId = req.body.tweetId;
  try{
    if(!tweetId){
      res.status(401).json({error: "Provide id of tweet to like"});
    }
    else{
      const tweet = await Tweet.findOne({_id: tweetId});
      if(!tweet){
        res.status(401).json({error: "Invalid tweet to like"});
      }
      else{
        if(!tweet.likes.includes(req.userData.userId)){
          tweet.likes.push(req.userData.userId);
          await tweet.save();
          res.status(200).json("Liked");
        }
        else{
          tweet.likes = tweet.likes.filter((id) => id !== req.userData.userId);
          await tweet.save();
          res.status(200).json("Not Liked");
        }
      }
    }
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});


router.get('/user', authMiddleware, async (req, res) => {
  try{
    const user = await User.findOne({_id: req.userData.userId}).select(['-password', '-token']);;
    if(!user){
      res.status(500).json({error: "Internal Server Error"});
    }
    else{
      res.status(200).json({user: user});
    }
  }
  catch(error) {
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.post('/user', authMiddleware, async (req, res) => {
  const id = req.body.id;
  console.log(id);
  try{
    const user = await User.findOne({_id: id}).select(['-password', '-token']);
    if(!user){
      res.status(401).json({error: "Not exists"});
    }
    else{
      res.status(200).json({user: user});
    }
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
module.exports = router;

