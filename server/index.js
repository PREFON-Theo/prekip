const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
require('dotenv').config();
const path = require('path')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${path.parse(file.originalname.replace(/\s/g, '_')).name}_${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}_${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

const Article = require('./models/Article')

mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://mongo/prekip')
    .then(() => console.log("Connected"))
    .catch(()=> console.log("Not connected"))


const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: `${process.env.URL}:3000`
}))

app.use('/uploads', express.static('uploads')) 

const UserRoutes = require('./routes/user');
const EventRoutes = require('./routes/event');
const ArticleRoutes = require('./routes/article');
const StatRoutes = require('./routes/stat');
const RubriqueTypeRoutes = require('./routes/rubriquetype');
const LikeRoutes = require('./routes/like');
const CommentsRoutes = require('./routes/comment');
const ForumRoutes = require('./routes/forum');
const AnswerRoutes = require('./routes/answer');
const HomelinkRoutes = require('./routes/homelink');

app.use('/user', UserRoutes);
app.use('/event', EventRoutes);
app.use('/article', ArticleRoutes);

app.post('/article/with-file', upload.any('image'), async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          let image = '';
          let file = '';
          for (let fi = 0; fi < req.files.length; fi++) {
            if(req.files[fi].mimetype === "application/pdf"){
              file = req.files[fi];
            }
            else {
              image = req.files[fi];
            } 
          }
          const {title, preview, content, category, author, type, important, created_at, updated_at} = req.body
          const articleCreation = await Article.create({
            title,
            preview,
            content,
            category,
            author,
            image,
            file,
            type,
            important,
            created_at,
            updated_at,
          })
          res.status(200).json(articleCreation)
        }
      })
    }
    else {
      res.json(null)
    }
  }
  catch (error) {
    res.status(400).json(error)
  }
    
})

app.use('/stat', StatRoutes);
app.use('/rubrique-type', RubriqueTypeRoutes);
app.use('/like', LikeRoutes);
app.use('/comment', CommentsRoutes);
app.use('/forum', ForumRoutes);
app.use('/answer', AnswerRoutes);
app.use('/homelink', HomelinkRoutes);


app.listen('4000', console.log("Running on port 4000"));