const express = require('express');
const router = express.Router();
const Event = require('../models/Event')

//Get All - OK
router.get('/', async (req, res) => {
  const getEvents = await Event.find().sort({startDate: -1})
  res.json(getEvents);
})

//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const EventInfo = await Event.findOne({_id: req.params.id})
      res.status(200).json(EventInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one event - OK
router.post('/', async (req, res) => {
  try {
      const {title, description, startDate, finishDate, owner, type, usersTagged} = req.body
      const eventCreation = await Event.create({
          title,
          description,
          startDate,
          finishDate,
          owner,
          type,
          usersTagged
      })
      res.status(200).json(eventCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one event - OK
router.patch('/:id', (req, res) => {
  try {
      Event.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Event ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one event - OK
router.delete('/:id', (req, res) => {
  try {
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
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
});

module.exports = router;