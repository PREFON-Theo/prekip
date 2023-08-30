const express = require('express');
const router = express.Router();
const Comments = require('../models/Comments')

//Get All - TODO
router.get('/', async (req, res) => {
  const getComments = await Comments.find().sort({date: -1})
  res.json(getComments);
})

//Get one - TODO
router.get('/:id', async (req, res) => {
  try {
      const CommentInfo = await Comments.findOne({_id: req.params.id})
      res.status(200).json(CommentInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get all comment of an article - TODO
router.get('/article/:article_id', async (req, res) => {
  try {
      const CommentInfo = await Comments.find({article_id: req.params.article_id}).sort({date: -1})
      res.status(200).json(CommentInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one comment - TODO
router.post('/', async (req, res) => {
  try {
      const {text, user_id, date, article_id} = req.body
      const commentCreation = await Comments.create({
          text,
          user_id,
          date,
          article_id
      })
      res.status(200).json(commentCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one comment - TODO
router.patch('/:id', (req, res) => {
  try {
      Comments.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Comment ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one comment - TODO
router.delete('/:id', (req, res) => {
  try {    
    Comments.deleteOne({_id: req.params.id}).then(() => {
      res.status(200).json({
        message: `Comment ${req.params.id} deleted`
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

//Delete all comment from an article - TODO
router.delete('/article/:article_id', (req, res) => {
  try {    
    Comments.deleteMany({article_id: req.params.article_id}).then(() => {
      res.status(200).json({
        message: `Comments from article ${req.params.article_id} deleted`
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