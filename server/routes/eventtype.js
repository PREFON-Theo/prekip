const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

//Get All - OK
router.get('/', async (req, res) => {
  const getEventTypes = await EventType.find()
  res.json(getEventTypes);
})

//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const EventTypeInfo = await EventType.findOne({_id: req.params.id})
      res.status(200).json(EventTypeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one event type  - OK
router.post('/', async (req, res) => {
  try {
      const {title, description, parent, color} = req.body
      const eventCreation = await EventType.create({
          title,
          description,
          parent,
          color
      })
      res.status(200).json(eventCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one event type  - OK
router.patch('/:id', (req, res) => {
  try {
      EventType.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one event type - OK
router.delete('/:id', (req, res) => {
  try {
      EventType.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
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