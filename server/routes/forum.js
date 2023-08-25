const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum')

//Get all - OK
router.get('/', async (req, res) => {
  const getForum = await Forum.find()
  res.json(getForum);
}) 


//Get last - OK
router.get('/last/:length', async (req, res) => {
  const getForum = await Forum.find().sort({created_at: -1}).limit(req.params.length)
  res.json(getForum)
})



//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const ForumInfo = await Forum.findOne({_id: req.params.id})
      res.status(200).json(ForumInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

router.get('/stats/global', async (req, res) => {
  try {
    const openedTopic = await Forum.find({closed: false})
    const closedTopic = await Forum.find({closed: true})

    res.status(200).json({
      opened: openedTopic.length,
      closed: closedTopic.length,
      total: openedTopic.length + closedTopic.length
    })
  }
  catch (err) {
    res.status(400).json(e)
  }
})


//Add one forum - OK
router.post('/', async (req, res) => {
  try {
      const {title, description, author, closed, created_at, updated_at} = req.body
      const forumCreation = await Forum.create({
        title,
        description,
        author,
        closed,
        created_at,
        updated_at
      })
      res.status(200).json(forumCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
  
})



//Update one forum - OK
router.patch('/:id', (req, res) => {
  try {
      Forum.updateOne({_id: req.params.id}, req.body).then(() => {
          res.status(200).json({
              message: `Forum ${req.params.id} updated`
          })
      })
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Delete one forum - OK
router.delete('/:id', (req, res) => {
  try {
      Forum.findOne({_id: req.params.id}).then((r) => {
        /*fs.remove(`../uploadsFile/${r.file}`)
          fs.remove(`../uploadsImage/${r.image}`)*/
      })
      Forum.deleteOne({_id: req.params.id}).then(() => {
          /*res.status(200).json({
              message: "Deleted"
          })*/
          res.json({
            message: `Forum ${req.params.id} deleted`
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