const express = require('express');
const router = express.Router();
const Stat = require('../models/Stats')

//Get All - TODO
router.get('/', async (req, res) => {
  const getStats = await Stat.find()
  res.json(getStats);
})

//Get one - TODO
router.get('/:id', async (req, res) => {
  try {
      const StatInfo = await Stat.findOne({_id: req.params.id})
      res.status(200).json(StatInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one stat - TODO
router.post('/', async (req, res) => {
  try {
      const {value, text, link, currency, type} = req.body
      const statCreation = await Stat.create({
          value,
          text,
          link,
          currency,
          type
      })
      res.status(200).json(statCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one stat - TODO
router.patch('/:id', (req, res) => {
  try {
      Stat.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Stat ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one stat - TODO
router.delete('/:id', (req, res) => {
  try {
      Stat.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
              message: `Stats ${req.params.id} deleted`
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