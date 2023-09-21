const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
require('dotenv').config();
const path = require('path')
const fs = require('fs')

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

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
            if([
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ].includes(req.files[fi].mimetype)){
              file = req.files[fi];
              file.originalname = req.body.fileName
            }
            else if(["image/png", "image/jpg", "image/jpeg"].includes(req.files[fi].mimetype)) {
              image = req.files[fi];
              image.originalname = req.body.imageName

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
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
    res.status(400).json(error)
  }
    
})

app.patch('/article/with-file/:id', upload.any('image'), async (req, res) => {
  try {
    console.log("go---------------------------")
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const art = await Article.findOne({_id: req.params.id})
          const auth = art.author
          if(err || user.id === undefined) {
            return res.status(403).json("Unauthorized")
          }
          else if(user.roles.includes('Administrateur') || user.id === auth){

            let image = '';
            let file = '';
            for (let fi = 0; fi < req.files.length; fi++) {
              if([
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ].includes(req.files[fi].mimetype)){
                file = req.files[fi];
                file.originalname = req.body.fileName
              }
              else if(["image/png", "image/jpg", "image/jpeg"].includes(req.files[fi].mimetype)) {
                image = req.files[fi];
                image.originalname = req.body.imageName
              } 
            }

            const originalFileImported = req.body.originalFileImported.replace(/\s+/g, ' ').trim()
            const originalImageImported = req.body.type === "article" ? req.body.originalImageImported.replace(/\s+/g, ' ').trim() : ""

            const dataToEdit = {
              title : req.body.title,
              preview : req.body.preview,
              content : req.body.content,
              category : req.body.category,
              author : req.body.author,
              type : req.body.type,
              important : req.body.important,
              created_at : req.body.created_at,
              updated_at : req.body.updated_at
            }

            if(file === '') { //pas de fichier dans l'input
              //console.log("File: rien à changer")
              file = undefined
            }
            else { //fichier dans l'input
              dataToEdit.file = file
              if(originalFileImported === ""){ // pas de fichier au début
                //console.log("File: nv fichier, file=file")
              }
              else {
                console.log("File: remplacer, supprimer l'original, file=file")
                const path = "/api/" + originalFileImported
                //console.log(path)
                if(fs.existsSync(path)){
                  //console.log("File to delete:", path)
                  fs.unlinkSync(path);
                }
              }
            }

            if(req.body.type === "article"){
              if(image === '') { //pas d'image dans l'input
                //console.log("Image: rien à changer")
                image = undefined
              }
              else { //image dans l'input
                dataToEdit.image = image
                if(originalImageImported === ""){ // pas d'image au début
                  //console.log("Image: nv image, image=image")
                }
                else {
                  //console.log("Image: remplacer, supprimer l'original, image=image")
                  const path = "/api/" + originalImageImported
                  //console.log(path)
                  if(fs.existsSync(path)){
                    //console.log("Image to delete:", path)
                    fs.unlinkSync(path);
                  }
                }
              }
            }

            await Article.updateOne({_id: req.params.id}, 
            dataToEdit
            )
            res.status(200).json({
              message: `Event ${req.params.id} updated`
            })

          }
          else {
            res.status(403).json('Unauthorized')
          }

        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
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