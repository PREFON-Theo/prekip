const express = require('express');
const router = express.Router();
const Homelink = require('../models/Homelink');

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

//Get All - OK
router.get('/', async (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const getHomelinks = await Homelink.find().sort({place: 1})
        res.json(getHomelinks);
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
      const HomelinkInfo = await Homelink.findOne({_id: req.params.id})
      res.status(200).json(HomelinkInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})*/

//Add one - OK
router.post('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const {text, link, place} = req.body
          const homelinkCreation = await Homelink.create({
              text,
              link,
              place
          })
          res.status(200).json(homelinkCreation)
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

//Update one - OK
router.patch('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          Homelink.updateOne({_id: req.params.id}, req.body).then(() => {
            res.status(200).json({
                message: `Homelink ${req.params.id} updated`
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
})


//Delete one - OK
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          Homelink.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
              message: `Homelink ${req.params.id} deleted`
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