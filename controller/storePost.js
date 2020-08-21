const path = require('path');
const Post = require("../database/models/Post");
const cloudinary = require('cloudinary')

module.exports = (req,res) =>
{
  console.log(req.files)
  const {image} = req.files

  const uploadPath = path.resolve(__dirname,'..','public/posts',image.name);

image.mv(uploadPath, (error)=>
{
  cloudinary.v2.uploader.upload(uploadPath,(error,result)=>
  {
    if(error)
    {
      return redirect('/')
    }
  Post.create(

    {
      ...req.body,
      image: result.secure_url,
      author: req.session.userId
    },(error,post)=>

    {
      res.redirect("/");
    }
  )
})

})
}
