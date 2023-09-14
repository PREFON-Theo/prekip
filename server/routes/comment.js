const express = require('express');
const router = express.Router();
const Comments = require('../models/Comments')
const Article = require('../models/Article')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

//Get All - TODO
router.get('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const getComments = await Comments.find().sort({date: -1})
          res.json(getComments);
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

//Get one - TODO
/*router.get('/:id', async (req, res) => {
  try {
      const CommentInfo = await Comments.findOne({_id: req.params.id})
      res.status(200).json(CommentInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})*/

//Get all comment of an article - TODO
router.get('/article/:article_id', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const CommentInfo = await Comments.find({article_id: req.params.article_id}).sort({date: -1})
        res.status(200).json(CommentInfo)
        
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

//Add one comment - TODO
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {text, user_id, date, article_id} = req.body
        const commentCreation = await Comments.create({
            text,
            user_id,
            date,
            article_id
        })
        res.status(200).json(commentCreation)
        
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

//Update one comment - TODO
/*router.patch('/:id', (req, res) => {
  try {
      Comments.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Comment ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})*/

//Delete one comment - TODO
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const com = await Comments.findOne({_id: req.params.id})
        const author = com.user_id
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Comments.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
              message: `Comment ${req.params.id} deleted`
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
});

//Delete all comment from an article - TODO
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
          Comments.deleteMany({article_id: req.params.article_id}).then(() => {
            res.status(200).json({
              message: `Comments from article ${req.params.article_id} deleted`
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
});

module.exports = router;