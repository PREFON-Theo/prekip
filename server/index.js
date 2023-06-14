const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")

const User = require('./models/User');
const Event = require('./models/Event');
//const Article = require('./models/Article');
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


/*--------------------------------------*/
/*--------------User Table--------------*/
/*--------------------------------------*/

//Get All Users - OK
app.get('/users', async (req, res) => {
    const getUser = await User.find()
    res.json(getUser);
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

/*---------------------------------------*/
/*--------------Event Table--------------*/
/*---------------------------------------*/

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
        const {title, description, startDate, finishDate, owner, type} = req.body
        const eventCreation = await Event.create({
            title,
            description,
            startDate,
            finishDate,
            owner,
            type,
        })
        res.status(200).json(eventCreation)
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
    
})

//Update on event - OK
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

//Delete on event - OK
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

/*---------------------------------------*/
/*----------------Article----------------*/
/*---------------------------------------*/
/*app.post('/article', (req,res) => {
    try {
        Article.create({})

    }
    catch (e) {

    }
})*/

app.listen('4000', console.log("Running on port 4000"));