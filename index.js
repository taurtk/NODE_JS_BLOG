require('dotenv').config();
const express = require('express');
const expressEdge = require('express-edge');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
//const cors = require('cors')
const createPostController = require('./controller/createPost');
const homePageController = require('./controller/homePage');
const storePostController = require('./controller/storePost');
const getPostController = require('./controller/getPost');
const createUserController = require('./controller/createUser');
const storeUserController = require('./controller/storeUser');
const loginController = require('./controller/login');
const loginUserController = require('./controller/loginUser');
const logoutController = require('./controller/logout');
const connectFlash = require('connect-flash');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const edge = require('edge.js')

const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload')
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const auth = require('./middleware/auth');
mongoose.connect(process.env.DB_URI);
const storePost = require('./middleware/storePost');

const mongoStore = connectMongo(expressSession);
//app.use(cors)
app.use(fileUpload())
app.use(express.static('public'));
app.use(expressEdge.engine);
app.set('views', `${__dirname}/views`);
app.use(expressSession(
  {
    secret: process.env.EXPRESS_SESSION_KEY,
    store: new mongoStore({
      mongooseConnection:mongoose.connection
    })
  }
))

cloudinary.config(
  {
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
  }
)
app.use('*',(req,res,next)=>
{
  edge.global('auth',req.session.userId);

  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(connectFlash());



app.get("/",homePageController );
app.get("/auth/logout",auth,logoutController)
app.get("/auth/register", redirectIfAuthenticated,createUserController);
app.get('/posts/new',createPostController);
app.get('/auth/login',redirectIfAuthenticated,loginController);
app.post('/users/login',redirectIfAuthenticated,loginUserController);
app.post('/post/store',auth,storePost,storePostController);
app.post('/user/register',redirectIfAuthenticated,storeUserController);
app.get('/post/:id',getPostController);




app.get('/contact',(req,res) =>{
  res.render('contact')
})
app.get('/about',(req,res) =>{
  res.render('about')
  
})

app.use((req,res) => res.render('not-found'));

 app.listen(process.env.PORT || 4000, () =>
 {
   console.log(`App listening on port ${process.env.PORT}`);
 });

// (async()=>
// {
//   const tunnel = await localtunnel({port:3000});

//   tunnel.url;

//   tunnel.on('close',()=>
//   {

//   })


// })