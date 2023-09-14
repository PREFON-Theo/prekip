const express = require('express');
const router = express.Router();
const Like = require('../models/Like')
const Article = require('../models/Article')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

//Get All - OK
/*router.get('/', async (req, res) => {
  const GetLikes = await Like.find()
  res.json(GetLikes);
})*/

//Get likes of user - OK
/*router.get('/user/:userId', async (req, res) => {
  try {
      const LikeInfo = await Like.find({user_id: req.params.userId})
      res.status(200).json(LikeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})*/

//Get likes of article - OK
router.get('/article/:articleId', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const LikeInfo = await Like.find({article_id: req.params.articleId})
        res.status(200).json(LikeInfo)
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

//Add one event - OK
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {user_id, article_id} = req.body
        const likeCreation = await Like.create({
          user_id,
          article_id,
        })
        res.status(200).json(likeCreation)
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


//Delete one like - OK
router.delete('/user/:userId/:articleId', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.id === req.params.userId){
          Like.deleteMany({
            user_id: req.params.userId,
            article_id: req.params.articleId
          }).then(() => {
            res.status(200).json({
              message: `Like for the user ${req.params.userId} on the article ${req.params.articleId} deleted`
            })
          })
        }
        else {
          res.status(403).json('Unauthorized')
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
});

//Delete one like - OK
/*router.delete('/:id', (req, res) => {
  try {
      Like.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
              message: `Like ${req.params.id} deleted`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
});*/

//Delete all like on an article - OK
router.delete('/article/:article_id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const art = await Article.findOne({_id: req.params.article_id})
        const author = art.author
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Like.deleteMany({article_id: req.params.article_id}).then(() => {
            res.status(200).json({
              message: `Likes on article ${req.params.article_id} deleted`
            })
          })
        }
        else {
          res.status(403).json('Unauthorized')
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
});

module.exports = router;