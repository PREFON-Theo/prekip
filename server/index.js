const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
require('dotenv').config();




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


app.listen('4000', console.log("Running on port 4000"));