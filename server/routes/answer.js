const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer')
const Forum = require('../models/Forum')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'


//Get All - OK
router.get('/', async (req, res) => {
    
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const getAnswer = await Answer.find().sort({created_at: -1})
          res.json(getAnswer);
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
})

//Get one - OK
/*router.get('/:id', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const AnswerInfo = await Answer.findOne({_id: req.params.id})
        res.status(200).json(AnswerInfo)
        
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
    res.status(400).json(error)
  }
})*/

//Get all answers of an topic (forum) - OK
router.get('/forum/:forum_id', async (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const AnswerInfo = await Answer.find({forum_id: req.params.forum_id}).sort({created_at: -1})
        res.status(200).json(AnswerInfo)
        
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

//Add one answer - OK
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {text, user_id, article_id, forum_id} = req.body
        const answerCreation = await Answer.create({
          text,
          user_id,
          article_id,
          forum_id
        })
        res.status(200).json(answerCreation)
        
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

//Update one answer - OK
router.patch('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        Answer.updateOne({_id: req.params.id}, {vote: req.body.vote}).then(() => {
          res.status(200).json({
            message: `Answer ${req.params.id} updated`
          })
        })
        
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

//Delete one answer - OK
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const answ = await Answer.findOne({_id: req.params.id})
        const author = answ.user_id
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Answer.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
              message: `Answer ${req.params.id} deleted`
            })
          })
        }
        else {
          return res.status(403).json("Unauthorized")
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

//Delete one answer - OK
router.delete('/forum/:forum_id', (req, res) => {
    try {
      const token = req.headers.jwt;
      if(token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
          const frm = await Forum.findOne({_id: req.params.forum_id})
          const author = frm.author
          if(err || user.id === undefined) {
            return res.status(403).json("Unauthorized")
          }
          else if(user.roles.includes('Administrateur') || user.id === author){
            Answer.deleteMany({forum_id: req.params.forum_id}).then(() => {
              res.status(200).json({
                message: `Answers for the forum ${req.params.forum_id} deleted`
              })
          })
          }
          else {
            return res.status(403).json("Unauthorized")
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