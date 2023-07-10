const express = require('express');
const router = express.Router();
const Like = require('../models/Like')

//Get All - OK
router.get('/', async (req, res) => {
  const GetLikes = await Like.find()
  res.json(GetLikes);
})

//Get likes of user - OK
router.get('/user/:userId', async (req, res) => {
  try {
      const LikeInfo = await Like.find({user_id: req.params.userId})
      res.status(200).json(LikeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get likes of article - OK
router.get('/article/:articleId', async (req, res) => {
  try {
      const LikeInfo = await Like.find({article_id: req.params.articleId})
      res.status(200).json(LikeInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one event - OK
router.post('/', async (req, res) => {
  try {
      const {user_id, article_id} = req.body
      const likeCreation = await Like.create({
          user_id,
          article_id,
      })
      res.status(200).json(likeCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})


//Delete one like - OK
router.delete('/:userId/:articleId', (req, res) => {
  try {
      Like.deleteMany({
          user_id: req.params.userId,
          article_id: req.params.articleId
      }).then(() => {
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

//Delete one like - OK
router.delete('/:id', (req, res) => {
  try {
      Like.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
              message: "Deleted"
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
});

module.exports = router;