const User = require('../database/models/User')
const bcrypt = require('bcrypt');
module.exports = (req,res) =>
{
  const {email,password} = req.body;

  User.findOne({email},(error, user)=>
  {
    if(user)
    {
      bcrypt.compare(password,user.password, (error,same)=>
      {
        if(same)
        {
        
        req.session.userId = user._id
         return  res.redirect('/')
        }
        else
        {
          console.log(error)
          res.redirect('/auth/login')
        }
      })
    }
    else{
      console.log(error)
        res.redirect('/auth/login')
    }
  })

}