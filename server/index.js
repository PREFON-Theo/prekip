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
const Stats = require('./models/Stats');
const StatsType = require('./models/StatsType');
const RubriqueType = require('./models/RubriqueType');
const Like = require('./models/Like');
require('dotenv').config();

const bcryptSecret = bcrypt.genSaltSync(10);
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'

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
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, bcryptSecret)
        }
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
    const {firstname, lastname, email, password, role, joiningDate, leavingDate, valid} = req.body
    const userCreation = await User.create({
        firstname,
        lastname,
        email,
        password:bcrypt.hashSync(password, bcryptSecret),
        role,
        joiningDate,
        leavingDate,
        valid
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
            const {_id, firstname, lastname, email, password, role, joiningDate, leavingDate, valid} = await User.findById(user.id); 
            res.json({_id, firstname, lastname, email, password, role, joiningDate, leavingDate, valid})
        })
    }
    else {
        res.json(null)
    }
})

app.delete('/user/:id', (req, res) => {
    try {
        User.deleteOne({_id: req.params.id}).then(() => {
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
/*-----------Event Types Table-----------*/
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
/*------------ Article Table ------------*/
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

//Get articles by category - OK
app.get('/article-category/:id', async (req, res) => {
    try {
        const ArticleInfo = await Article.find({category: req.params.id})
        res.status(200).json(ArticleInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})


//Create - OK
app.post('/article', upload.single('file'), async (req, res) => {
    try {
        const {title, preview, content, category, author, image, created_at, updated_at} = req.body
        const articleCreation = await Article.create({
            title,
            preview,
            content,
            category,
            author,
            image,
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
app.patch('/article/:id', (req, res) => {
    try {
        const {title, preview, content, category, author, image, file} = req.body
        Article.updateOne({_id: req.params.id}, {
            title,
            preview,
            content,
            category,
            author,
            image,
            file,
            updated_at: new Date(),
        }).then(() => {
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


///////////////////////////////////////////
/*---------------------------------------*/
/*--------------Stats Table--------------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - TODO
app.get('/stats', async (req, res) => {
    const getStats = await Stats.find()
    res.json(getStats);
})

//Get one - TODO
app.get('/stat/:id', async (req, res) => {
    try {
        const StatInfo = await Stats.findOne({_id: req.params.id})
        res.status(200).json(StatInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one stat - TODO
app.post('/stat', async (req, res) => {
    try {
        const {value, text, link, currency, type} = req.body
        const statCreation = await Stats.create({
            value,
            text,
            link,
            currency,
            type
        })
        res.status(200).json(statCreation)
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
    
})

//Update one stat - TODO
app.patch('/stat/:id', (req, res) => {
    try {
        Stats.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one stat - TODO
app.delete('/stat/:id', (req, res) => {
    try {
        Stats.deleteOne({_id: req.params.id}).then(() => {
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
/*------------Stats type Table-----------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - TODO
app.get('/stat-types', async (req, res) => {
    const getStatTypes = await StatsType.find()
    res.json(getStatTypes);
})

//Get one - TODO
app.get('/stat-type/:id', async (req, res) => {
    try {
        const StatTypeInfo = await StatsType.findOne({_id: req.params.id})
        res.status(200).json(StatTypeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one stat-type  - TODO
app.post('/stat-type', async (req, res) => {
    try {
        const {title} = req.body
        const StatCreation = await StatsType.create({
            title
        })
        res.status(200).json(StatCreation)
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
    
})

//Update one stat-type  - TODO
app.patch('/stat-type/:id', (req, res) => {
    try {
        StatsType.updateOne({_id: req.params.id}, req.body).then(() => {
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

//Delete one stat-type - TODO
app.delete('/stat-type/:id', (req, res) => {
    try {
        StatsType.deleteOne({_id: req.params.id}).then(() => {
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
/*----------Rubrique type Table----------*/
/*---------------------------------------*/
///////////////////////////////////////////

//Get All - OK
app.get('/rubrique-types', async (req, res) => {
    const getRubriqueType = await RubriqueType.find()
    res.json(getRubriqueType);
})

//Get All Parent - OK
app.get('/rubrique-types-parents', async (req, res) => {
    const getRubriqueType = await RubriqueType.find({parent: { $eq: "" }})
    res.json(getRubriqueType);
})


//Get one - OK
app.get('/rubrique-type/:id', async (req, res) => {
    try {
        const RubriqueTypeInfo = await RubriqueType.findOne({_id: req.params.id})
        res.status(200).json(RubriqueTypeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Get one by link - OK
app.get('/rubrique-link/:element', async (req, res) => {
    try {
        const RubriqueTypeInfo = await RubriqueType.find({link: req.params.element})
        res.status(200).json(RubriqueTypeInfo)
    }
    catch (e){
        res.status(400).json(e)
    }
})

//Add one rubrique-type  - OK
app.post('/rubrique-type', async (req, res) => {
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
app.patch('/rubrique-type/:id', (req, res) => {
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
app.delete('/rubrique-type/:id', (req, res) => {
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