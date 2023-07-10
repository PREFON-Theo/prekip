const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
require('dotenv').config();




const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected"))
    .catch(()=> console.log("Not connected"))


const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/uploads', express.static('uploads'))

const UserRoutes = require('./routes/user');
const EventRoutes = require('./routes/event');
const EventTypeRoutes = require('./routes/eventtype');
const ArticleRoutes = require('./routes/article');
const StatRoutes = require('./routes/stat');
const StatTypeRoutes = require('./routes/stattype');
const RubriqueTypeRoutes = require('./routes/rubriquetype');
const LikeRoutes = require('./routes/like');
const CommentsRoutes = require('./routes/comment');
app.use('/user', UserRoutes);
app.use('/event', EventRoutes);
app.use('/event-type', EventTypeRoutes);
app.use('/article', ArticleRoutes);
app.use('/stat', StatRoutes);
app.use('/stat-type', StatTypeRoutes);
app.use('/rubrique-type', RubriqueTypeRoutes);
app.use('/like', LikeRoutes);
app.use('/comment', CommentsRoutes);


///////////////////////////////////////////
/*---------------------------------------*/
/*---------------Like Table--------------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - OK
app.get('/likes', async (req, res) => {
    const GetLikes = await Like.find()
    res.json(GetLikes);
})

//Get likes of user - OK
app.get('/likes-of-user/:userId', async (req, res) => {
    try {
        const LikeInfo = await Like.find({user_id: req.params.userId})
        res.status(200).json(LikeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Get likes of article - OK
app.get('/likes-of-article/:articleId', async (req, res) => {
    try {
        const LikeInfo = await Like.find({article_id: req.params.articleId})
        res.status(200).json(LikeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one event - OK
app.post('/like', async (req, res) => {
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
app.delete('/likes/:userId/:articleId', (req, res) => {
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
app.delete('/like/:id', (req, res) => {
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


app.listen('4000', console.log("Running on port 4000"));