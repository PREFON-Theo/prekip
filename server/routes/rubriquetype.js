const express = require('express');
const router = express.Router();
const RubriqueType = require('../models/RubriqueType')

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
        const getRubriqueType = await RubriqueType.find()
        res.json(getRubriqueType);
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

//Get All Parent - OK
router.get('/parents', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const getRubriqueType = await RubriqueType.find({parent: { $eq: "" }})
        res.json(getRubriqueType);        
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
        const RubriqueTypeInfo = await RubriqueType.findOne({_id: req.params.id})
        res.status(200).json(RubriqueTypeInfo)          
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

//Get one by link - OK
router.get('/link/:element', async (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const RubriqueTypeInfo = await RubriqueType.find({link: req.params.element})
        res.status(200).json(RubriqueTypeInfo)        
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

//Add one rubrique-type  - OK
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {title, description, parent, link, imgLink} = req.body
        const RubriqueTypeCreation = await RubriqueType.create({
          title,
          description,
          parent,
          link,
          imgLink
        })
        res.status(200).json(RubriqueTypeCreation)
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

//Update one rubrique-type  - OK
router.patch('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        RubriqueType.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
            message: `Rubrique ${req.params.id} updated`
          })
        })
        
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

//Delete one rubrique-type - OK
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          RubriqueType.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
              message: `Rubrique ${req.params.id} deleted`
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