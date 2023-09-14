const express = require('express');
const router = express.Router();
const Event = require('../models/Event')

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
        const getEvents = await Event.find().sort({startDate: -1})
        res.json(getEvents);
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
router.get('/:id', async (req, res) => {  
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const EventInfo = await Event.findOne({_id: req.params.id})
        const owner = EventInfo.owner
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.roles.includes('Modérateur') || user.id === owner){
          res.status(200).json(EventInfo)
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

//Get all event of a day - OK
router.get('/day/:date', async (req, res) => {
    try {
      const token = req.headers.jwt;
      if(token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
          if(err || user.id === undefined) {
            return res.status(403).json("Unauthorized")
          }
          const d = new Date(req.params.date)
          const dplus = new Date(req.params.date).setDate(d.getDate()+1)
          const EventsOfThisDay = await Event.find({$and : [ {startDate: {$gte: d}}, {startDate: {$lte: dplus}}]})
          res.status(200).json(EventsOfThisDay)            
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
        const {title, description, startDate, finishDate, owner, type} = req.body
        const eventCreation = await Event.create({
            title,
            description,
            startDate,
            finishDate,
            owner,
            type
        })
        res.status(200).json(eventCreation)
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

//Add multiple event - TODO
router.post('/many', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const eventsCreation = await Event.create(req.body)
        res.status(200).json(eventsCreation)
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

//Update one event - OK
router.patch('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const vnt = await Event.findOne({_id: req.params.id})
        const owner = vnt.owner
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.roles.includes('Modérateur') || user.id === owner){
          Event.updateOne({_id: req.params.id}, req.body).then(() => {
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
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
    res.status(400).json(error)
  }
})

//Delete one event - OK
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const vnt = await Event.findOne({_id: req.params.id})
        const owner = vnt.owner
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.roles.includes('Modérateur') || user.id === owner){
          Event.deleteOne({_id: req.params.id}).then(() => {
              res.status(200).json({
                  message: `Event ${req.params.id} deleted`
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
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
    res.status(400).json(error)
  }
});

module.exports = router;