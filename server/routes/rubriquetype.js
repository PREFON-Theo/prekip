const express = require('express');
const router = express.Router();
const RubriqueType = require('../models/RubriqueType')

//Get All - OK
router.get('/', async (req, res) => {
  const getRubriqueType = await RubriqueType.find()
  res.json(getRubriqueType);
})

//Get All Parent - OK
router.get('/parents', async (req, res) => {
  const getRubriqueType = await RubriqueType.find({parent: { $eq: "" }})
  res.json(getRubriqueType);
})


//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const RubriqueTypeInfo = await RubriqueType.findOne({_id: req.params.id})
      res.status(200).json(RubriqueTypeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get one by link - OK
router.get('/link/:element', async (req, res) => {
  try {
      const RubriqueTypeInfo = await RubriqueType.find({link: req.params.element})
      res.status(200).json(RubriqueTypeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one rubrique-type  - OK
router.post('/', async (req, res) => {
  try {
      const {title, description, parent, link} = req.body
      const RubriqueTypeCreation = await RubriqueType.create({
          title,
          description,
          parent,
          link
      })
      res.status(200).json(RubriqueTypeCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one rubrique-type  - OK
router.patch('/:id', (req, res) => {
  try {
      RubriqueType.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one rubrique-type - OK
router.delete('/:id', (req, res) => {
  try {
      RubriqueType.deleteOne({_id: req.params.id}).then(() => {
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