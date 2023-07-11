const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
require('dotenv').config();

const multer  = require('multer')
const upload = multer({ dest: 'uploadsFile/' })

const Article = require('./models/Article')

mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://mongo/prekip')
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

app.post('/article', upload.single('file'), async (req, res) => {
    try {
        const file = req.file.path

        console.log(file)
        const {title, preview, content, category, author, image, created_at, updated_at} = req.body
        const articleCreation = await Article.create({
            title,
            preview,
            content,
            category,
            author,
            image,
            file,
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

app.use('/stat', StatRoutes);
app.use('/stat-type', StatTypeRoutes);
app.use('/rubrique-type', RubriqueTypeRoutes);
app.use('/like', LikeRoutes);
app.use('/comment', CommentsRoutes);


app.listen('4000', console.log("Running on port 4000"));