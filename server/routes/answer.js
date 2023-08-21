const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer')

//Get All - OK
router.get('/', async (req, res) => {
  const getAnswer = await Answer.find().sort({created_at: -1})
  res.json(getAnswer);
})

//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const AnswerInfo = await Answer.findOne({_id: req.params.id})
      res.status(200).json(AnswerInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get all answers of an topic (forum) - OK
router.get('/forum/:forum_id', async (req, res) => {
  try {
      const AnswerInfo = await Answer.find({forum_id: req.params.forum_id}).sort({created_at: -1})
      res.status(200).json(AnswerInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Add one answer - OK
router.post('/', async (req, res) => {
  try {
      const {text, user_id, article_id, forum_id} = req.body
      const answerCreation = await Answer.create({
          text,
          user_id,
          article_id,
          forum_id
      })
      res.status(200).json(answerCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})

//Update one answer - OK
router.patch('/:id', (req, res) => {
  try {
      Answer.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Answer ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one answer - OK
router.delete('/:id', (req, res) => {
  try {
      Answer.deleteOne({_id: req.params.id}).then(() => {
          res.status(200).json({
              message: `Answer ${req.params.id} deleted`
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

//Delete one answer - OK
router.delete('/forum/:forum_id', (req, res) => {
    try {
        Answer.deleteMany({forum_id: req.params.forum_id}).then(() => {
            res.status(200).json({
                message: `Answer for the forum ${req.params.forum_id} deleted`
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