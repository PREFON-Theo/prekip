const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")

const User = require('./models/User');
const Event = require('./models/Event');
const EventType = require('./models/EventType');
const Article = require('./models/Article');
require('dotenv').config();

const bcryptSecret = bcrypt.genSaltSync(10);
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

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

//////////////////////////////////////////
/*--------------------------------------*/
/*--------------User Table--------------*/
/*--------------------------------------*/
//////////////////////////////////////////

//Get All Users - OK
app.get('/users', async (req, res) => {
    const getUser = await User.find()
    res.json(getUser);
})

//Update one event - OK
app.patch('/user/:id', (req, res) => {
    try {
        User.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Inscription - OK
app.post('/register', async (req, res) => {
    const {username, email, password} = req.body
    const userCreation = await User.create({
        username,
        email,
        password:bcrypt.hashSync(password, bcryptSecret),
    })
    res.json(userCreation)
})

//Connexion - OK
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const userInfo = await User.findOne({email});
        if(userInfo) {
            const checkPwd = bcrypt.compareSync(password, userInfo.password)
            if(checkPwd) {
                jwt.sign({id: userInfo._id}, jwtSecret, {}, (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token).json(userInfo)

                })
            }
            else {
                res.json('Error password')
            }
        }
        else {
            res.json("Not found")
        }   
    }
    catch (e) {
        res.status(400).json(e)
    }
    
})

//Déconnexion - OK
app.post('/logout', async (req, res) => {
    res.cookie('token', '').json('ok');
})

app.get('/profil', (req, res) => {
    const {token} = req.cookies;
    if(token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const {_id, email, username} = await User.findById(user.id); 
            res.json({_id, email, username})
        })
    }
    else {
        res.json(null)
    }
})

///////////////////////////////////////////
/*---------------------------------------*/
/*--------------Event Table--------------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - OK
app.get('/events', async (req, res) => {
    const getEvents = await Event.find()
    res.json(getEvents);
})

//Get one - OK
app.get('/event/:id', async (req, res) => {
    try {
        const EventInfo = await Event.findOne({_id: req.params.id})
        res.status(200).json(EventInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one event - OK
app.post('/event', async (req, res) => {
    try {
        const {title, description, startDate, finishDate, owner, type, usersTagged} = req.body
        const eventCreation = await Event.create({
            title,
            description,
            startDate,
            finishDate,
            owner,
            type,
            usersTagged
        })
        res.status(200).json(eventCreation)
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
    
})

//Update one event - OK
app.patch('/event/:id', (req, res) => {
    try {
        Event.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one event - OK
app.delete('/event/:id', (req, res) => {
    try {
        Event.deleteOne({_id: req.params.id}).then(() => {
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


///////////////////////////////////////////
/*---------------------------------------*/
/*--------------Event Table--------------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - OK
app.get('/event-types', async (req, res) => {
    const getEventTypes = await EventType.find()
    res.json(getEventTypes);
})

//Get one - OK
app.get('/event-type/:id', async (req, res) => {
    try {
        const EventTypeInfo = await EventType.findOne({_id: req.params.id})
        res.status(200).json(EventTypeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one event type  - OK
app.post('/event-type', async (req, res) => {
    try {
        const {title, description, parent, color} = req.body
        const eventCreation = await EventType.create({
            title,
            description,
            parent,
            color
        })
        res.status(200).json(eventCreation)
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
    
})

//Update one event type  - OK
app.patch('/event-type/:id', (req, res) => {
    try {
        EventType.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one event type - OK
app.delete('/event-type/:id', (req, res) => {
    try {
        EventType.deleteOne({_id: req.params.id}).then(() => {
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

///////////////////////////////////////////
/*---------------------------------------*/
/*--------------- Article ---------------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - OK
app.get('/articles', async (req, res) => {
    const getArticles = await Article.find()
    res.json(getArticles);
})


//Get x last articles - OK
app.get('/last-articles/:length', async (req, res) => {
    const getArticles = await Article.find().sort({created_at: -1}).limit(req.params.length)
    res.json(getArticles)
})


//Get the last articles - 
app.get('/last-article', async (req, res) => {
    const getArticles = await Article.find().sort({created_at: -1}).limit(1)
    res.json(getArticles)
})


//Get 4 last articles with img - 
app.get('/last-articles-img', async (req, res) => {
    const getArticles = await Article.find({image: { $exists: true }}).sort({created_at: -1}).limit(4)
    res.json(getArticles)
})


//Get one - OK
app.get('/article/:id', async (req, res) => {
    try {
        const ArticleInfo = await Article.findOne({_id: req.params.id})
        res.status(200).json(ArticleInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})


//Create - OK
app.post('/article', async (req, res) => {
    try {
        const {title, preview, content, category, author, image} = req.body
        const articleCreation = await Article.create({
            title,
            preview,
            content,
            category,
            author,
            image,
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
app.patch('/article/:id', (req, res) => {
    try {
        Article.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one article - 
app.delete('/article/:id', (req, res) => {
    try {
        Article.deleteOne({_id: req.params.id}).then(() => {
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





app.listen('4000', console.log("Running on port 4000"));