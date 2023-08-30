const express = require('express');
const router = express.Router();
const Homelink = require('../models/Homelink');

//Get All - OK
router.get('/', async (req, res) => {
  const getHomelinks = await Homelink.find().sort({place: 1})
  res.json(getHomelinks);
})

//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const HomelinkInfo = await Homelink.findOne({_id: req.params.id})
      res.status(200).json(HomelinkInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one - OK
router.post('/', async (req, res) => {
  try {
      const {text, link, place} = req.body
      const homelinkCreation = await Homelink.create({
          text,
          link,
          place
      })
      res.status(200).json(homelinkCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one - OK
router.patch('/:id', (req, res) => {
  try {
      Homelink.updateOne({_id: req.params.id}, req.body).then(() => {
        res.status(200).json({
            message: `Homelink ${req.params.id} updated`
        })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})


//Delete one - OK
router.delete('/:id', (req, res) => {
  try {
      Homelink.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
              message: `Homelink ${req.params.id} deleted`
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