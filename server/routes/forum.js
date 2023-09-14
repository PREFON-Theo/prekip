const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum')

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

//Get all - OK
router.get('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const getForum = await Forum.find()
        res.json(getForum);
        
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


//Get last - OK
router.get('/last/:length', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const getForum = await Forum.find().sort({created_at: -1}).limit(req.params.length)
        res.json(getForum)
        
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



//Get one - OK
router.get('/:id', async (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const ForumInfo = await Forum.findOne({_id: req.params.id})
        res.status(200).json(ForumInfo)
        
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
          const openedTopic = await Forum.find({closed: false})
          const closedTopic = await Forum.find({closed: true})
        
          res.status(200).json({
            opened: openedTopic.length,
            closed: closedTopic.length,
            total: openedTopic.length + closedTopic.length
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


//Add one forum - OK
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {title, description, author, closed, created_at, updated_at} = req.body
        const forumCreation = await Forum.create({
          title,
          description,
          author,
          closed,
          created_at,
          updated_at
        })
        res.status(200).json(forumCreation)
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



//Update one forum - OK
router.patch('/:id', (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const frm = await Forum.findOne({_id: req.params.id})
        const author = frm.author
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Forum.updateOne({_id: req.params.id}, req.body).then(() => {
              res.status(200).json({
                  message: `Forum ${req.params.id} updated`
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

//Delete one forum - OK
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const frm = await Forum.findOne({_id: req.params.id})
        const author = frm.author
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === author){
          Forum.deleteOne({_id: req.params.id}).then(() => {
              res.status(200).json({
                  message: `Forum ${req.params.id} deleted`
              })
          }).catch((error) => {
              res.status(400).json({
                  error: error
              });
          });
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