const express = require('express');
const router = express.Router();
const Article = require('../models/Article')
const fs = require('fs')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'


router.get('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const getArticles = await Article.find().sort({created_at: -1})
          res.json(getArticles);
        }
        else {
          res.status(403).json('Unauthorized')
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

router.get('/type/:type', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const getContent = await Article.find({type: req.params.type})
          res.json(getContent);
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


router.get('/:type/last/:length', async (req, res) => {
  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const getArticles = await Article.find({type: req.params.type}).sort({created_at: -1}).limit(req.params.length)
          res.json(getArticles)
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


router.get('/lastest-important-article/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const getArticles = await Article.find({type: 'article', important: true}).sort({created_at: -1}).limit(1)
          res.json(getArticles)
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


//Get 4 last articles with img - 
/*router.get('/last-img', async (req, res) => {
  const getArticles = await Article.find({image: { $exists: true }}).sort({created_at: -1}).limit(4)
  res.json(getArticles)
})*/


//Get one - OK
router.get('/:id', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const ArticleInfo = await Article.findOne({_id: req.params.id})
          res.status(200).json(ArticleInfo)
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

router.get('/stats/global', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const getTypeArticle = await Article.find({type: 'article'})
          const getTypeActuality = await Article.find({type: 'actuality'})
          const getTypeReference = await Article.find({type: 'reference'})
          const getContentLength = await Article.find();

          res.json({
            article: getTypeArticle.length,
            actuality: getTypeActuality.length,
            reference: getTypeReference.length,
            total: getContentLength.length
          })
        }
        else {
          res.status(403).json('Unauthorized')
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

router.get('/stats/this-month', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          let d = new Date()
          d.setDate(1)
          d.setHours(0)
          d.setMinutes(0)
          d.setSeconds(0)

          const getTypeArticle = await Article.find({type: 'article',created_at: { $gte: d}})
          const getTypeActuality = await Article.find({type: 'actuality',created_at: { $gte: d}})
          const getTypeReference = await Article.find({type: 'reference',created_at: { $gte: d}})

          res.json({
            article: getTypeArticle.length,
            actuality: getTypeActuality.length,
            reference: getTypeReference.length,
            total: getTypeArticle.length + getTypeActuality.length + getTypeReference.length
          })
        }
        else {
          res.status(403).json('Unauthorized')
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

//Get articles by category - OK
/*router.get('/category/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.find({category: req.params.id})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})*/

//Get type by category - OK
router.get('/type/:type/category/:id', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const ArticleInfo = await Article.find({category: req.params.id, type: req.params.type})
          res.status(200).json(ArticleInfo)
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

//Get search for a text
router.get('/search/:text', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const textToSearch = req.params.text
            .replace(/a/g, '[a,á,à,ä,â]')
            .replace(/A/g, '[A,a,á,à,ä,â]')
            .replace(/e/g, '[e,é,ë,è]')
            .replace(/E/g, '[E,e,é,ë,è]')
            .replace(/i/g, '[i,í,ï,ì]')
            .replace(/I/g, '[I,i,í,ï,ì]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/O/g, '[O,o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]')
            .replace(/U/g, '[U,u,ü,ú,ù]');
          const category = req.query.category === undefined ? '' : req.query.category;
          const author = req.query.author === undefined ? '' : req.query.author;
          const date = req.query.date === "ascending" ? 1 : -1;
          const type = req.query.type === undefined ? '' : req.query.type;

          const ArticleInfo = await Article.find(
            {$and: [
              {$or: [ 
                {title: {$regex: textToSearch, $options: 'imxs'}},
                {preview: {$regex: textToSearch, $options: 'imxs'}},
                {content: {$regex: textToSearch, $options: 'imxs'}},
                {type: {$regex: textToSearch, $options: 'imxs'}},
              ]},
              {category: {$regex: category, $options: 'imxs'}},
              {author: {$regex: author, $options: 'imxs'}},
              {type: {$regex: type, $options: 'imxs'}},
            ]}
          ).sort({created_at: date});
          res.status(200).json(ArticleInfo);
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


router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const {title, preview, content, category, type, author, important, created_at, updated_at} = req.body
          const articleCreation = await Article.create({
              title,
              preview,
              content,
              category,
              author,
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

//Update one event - OK
router.patch('/:id', (req, res) => {

  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const art = await Article.findOne({_id: req.params.id})
        const author = art.author
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Article.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
            message: `Event ${req.params.id} updated`
            })
          })
        }
        else {
          res.status(403).json('Unauthorized')
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

//Delete one article - 
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const art = await Article.findOne({_id: req.params.id})
        const author = art.author
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Article.findOne({_id: req.params.id}).then((r) => {
            if(Object.values(r.file).length > 0){
              const path = "/api/" + r.file.path
              if(fs.existsSync(path)){
                fs.unlinkSync(path);
              }
            }
            if(Object.values(r.image).length > 0){
              const path = "/api/" + r.image.path
              if(fs.existsSync(path)){
                fs.unlinkSync(path);
              }
            }
          })
          Article.deleteOne({_id: req.params.id}).then(() => {
              res.status(200).json({
                message: `Article ${req.params.id} deleted`
              })
          }).catch((error) => {
              res.status(400).json({
                  error: error
              });
          })
        }
        else {
          res.status(403).json('Unauthorized')
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
});

module.exports = router;