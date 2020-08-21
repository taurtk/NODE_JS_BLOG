const Post = require('../database/models/Post');
const session = require('express-session');

module.exports = async (req,res)=>
{
  const posts = await Post.find({}).populate('author');
  console.log(req.session)
  
  res.render('index',{
    
    posts
  
  });
}