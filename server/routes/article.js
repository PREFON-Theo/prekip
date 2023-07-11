const express = require('express');
const router = express.Router();
const Article = require('../models/Article')

const multer  = require('multer')
const uploadFile = multer({ dest: '../uploadsFile/' })
const uploadImage = multer({ dest: '../uploadsImage/' })

const fs = require('fs-extra')

router.get('/', async (req, res) => {
  const getArticles = await Article.find()
  res.json(getArticles);
}) 


router.get('/last/:length', async (req, res) => {
  const getArticles = await Article.find().sort({created_at: -1}).limit(req.params.length)
  res.json(getArticles)
})


//Get 4 last articles with img - 
router.get('/last-img', async (req, res) => {
  const getArticles = await Article.find({image: { $exists: true }}).sort({created_at: -1}).limit(4)
  res.json(getArticles)
})


//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.findOne({_id: req.params.id})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get articles by category - OK
router.get('/category/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.find({category: req.params.id})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Create - OK

/*router.post('/', uploadFile.single('file'), uploadImage.single('image'), async (req, res) => {
  try {
    //const image = req.image.path
    const file = req.file.path

    const {title, preview, content, category, author, created_at, updated_at} = req.body
    const articleCreation = await Article.create({
      title,
      preview,
      content,
      category,
      author,
      //image,
      file,
      created_at,
      updated_at,
    })
    res.status(200).json(articleCreation)
  }
  catch (error) {
    res.status(400).json({
      error: error
    });
  }
  
})*/



//Update one event - OK
router.patch('/:id', (req, res) => {
  try {
      Article.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: "Updated"
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one article - 
router.delete('/:id', (req, res) => {
  try {
      Article.findOne({_id: req.params.id}).then((r) => {
        console.log(r)
        /*fs.remove(`../uploadsFile/${r.file}`)
          fs.remove(`../uploadsImage/${r.image}`)*/
      })
      Article.deleteOne({_id: req.params.id}).then(() => {
          /*res.status(200).json({
              message: "Deleted"
          })*/
          res.json({
            message: "Deleted"
          })
      }).catch((error) => {
          res.status(400).json({
              error: error
          });
      });
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
});

module.exports = router;