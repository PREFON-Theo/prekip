const express = require('express');
const router = express.Router();
const StatType = require('../models/StatsType')

//Get All - TODO
router.get('/', async (req, res) => {
  const getStatTypes = await StatType.find()
  res.json(getStatTypes);
})

//Get one - TODO
router.get('/:id', async (req, res) => {
  try {
      const StatTypeInfo = await StatType.findOne({_id: req.params.id})
      res.status(200).json(StatTypeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one stat-type  - TODO
router.post('/', async (req, res) => {
  try {
      const {title} = req.body
      const StatCreation = await StatType.create({
          title
      })
      res.status(200).json(StatCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one stat-type  - TODO
router.patch('/:id', (req, res) => {
  try {
      StatType.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one stat-type - TODO
router.delete('/:id', (req, res) => {
  try {
      StatType.deleteOne({_id: req.params.id}).then(() => {
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