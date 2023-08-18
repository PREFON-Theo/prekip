const express = require('express');
const router = express.Router();
const Article = require('../models/Article')


router.get('/', async (req, res) => {
  const getArticles = await Article.find().sort({created_at: -1})
  res.json(getArticles);
})

router.get('/type/:type', async (req, res) => {
  const getContent = await Article.find({type: req.params.type})
  res.json(getContent);
})


router.get('/:type/last/:length', async (req, res) => {
  const getArticles = await Article.find({type: req.params.type}).sort({created_at: -1}).limit(req.params.length)
  res.json(getArticles)
})


router.get('/lastest-important-article/', async (req, res) => {
  const getArticles = await Article.find({type: 'article', important: true}).sort({created_at: -1}).limit(1)
  res.json(getArticles)
})


//Get 4 last articles with img - 
router.get('/last-img', async (req, res) => {
  const getArticles = await Article.find({image: { $exists: true }}).sort({created_at: -1}).limit(4)
  res.json(getArticles)
})


//Get one - OK
router.get('/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.findOne({_id: req.params.id})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

router.get('/stats/global', async (req, res) => {
  try {
    const getTypeArticle = await Article.find({type: 'article'})
    const getTypeActuality = await Article.find({type: 'actuality'})
    const getTypeReference = await Article.find({type: 'reference'})
    const getContentLength = await Article.find();

    res.json({
      article: getTypeArticle.length,
      actuality: getTypeActuality.length,
      reference: getTypeReference.length,
      total: getContentLength.length
    })
  }
  catch (err) {
    res.status(400).json({
      error: err
  });
  }
})

router.get('/stats/this-month', async (req, res) => {
  try {
    let d = new Date()
    d.setDate(1)
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)

    const getTypeArticle = await Article.find({type: 'article',created_at: { $gte: d}})
    const getTypeActuality = await Article.find({type: 'actuality',created_at: { $gte: d}})
    const getTypeReference = await Article.find({type: 'reference',created_at: { $gte: d}})

    res.json({
      article: getTypeArticle.length,
      actuality: getTypeActuality.length,
      reference: getTypeReference.length,
      total: getTypeArticle.length + getTypeActuality.length + getTypeReference.length
    })
  }
  catch (err) {
    res.status(400).json({
      error: err
  });
  }
})

//Get articles by category - OK
router.get('/category/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.find({category: req.params.id})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get type by category - OK
router.get('/type/:type/category/:id', async (req, res) => {
  try {
      const ArticleInfo = await Article.find({category: req.params.id, type: req.params.type})
      res.status(200).json(ArticleInfo)
  }
  catch (e){
      res.status(400).json(e)
  }
})

//Get search for a text
router.get('/search/:text', async (req, res) => {
  try {
    const textToSearch = req.params.text
      .replace(/a/g, '[a,á,à,ä,â]')
      .replace(/A/g, '[A,a,á,à,ä,â]')
      .replace(/e/g, '[e,é,ë,è]')
      .replace(/E/g, '[E,e,é,ë,è]')
      .replace(/i/g, '[i,í,ï,ì]')
      .replace(/I/g, '[I,i,í,ï,ì]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/O/g, '[O,o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/U/g, '[U,u,ü,ú,ù]');
    const category = req.query.category === undefined ? '' : req.query.category;
    const author = req.query.author === undefined ? '' : req.query.author;
    const date = req.query.date === "ascending" ? 1 : -1;
    const type = req.query.type === undefined ? '' : req.query.type;

    const ArticleInfo = await Article.find(
      {$and: [
        {$or: [ 
          {title: {$regex: textToSearch, $options: 'imxs'}},
          {preview: {$regex: textToSearch, $options: 'imxs'}},
          {content: {$regex: textToSearch, $options: 'imxs'}},
          {type: {$regex: textToSearch, $options: 'imxs'}},
        ]},
        {category: {$regex: category, $options: 'imxs'}},
        {author: {$regex: author, $options: 'imxs'}},
        {type: {$regex: type, $options: 'imxs'}},
      ]}
    ).sort({created_at: date});
    res.status(200).json(ArticleInfo);
    
  }
  catch (e){
      res.status(400).json(e)
  }
})


router.post('/', async (req, res) => {
  try {
      const {title, preview, content, category, type, author, important, created_at, updated_at} = req.body
      const articleCreation = await Article.create({
          title,
          preview,
          content,
          category,
          author,
          type,
          important,
          created_at,
          updated_at,
      })
      res.status(200).json(articleCreation)
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
      Article.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one article - 
router.delete('/:id', (req, res) => {
  try {
    Article.findOne({_id: req.params.id}).then((r) => {
      console.log(r)
      /*fs.remove(`../uploadsFile/${r.file}`)
        fs.remove(`../uploadsImage/${r.image}`)*/
    })
    Article.deleteOne({_id: req.params.id}).then(() => {
        /*res.status(200).json({
            message: "Deleted"
        })*/
        res.json({
          message: `Article ${req.params.id} deleted`
        })
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
  }
  catch (error) {
      res.status(400).json(error);
  }
});

module.exports = router;