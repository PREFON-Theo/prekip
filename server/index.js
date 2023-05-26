const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")

const User = require('./models/User');
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


app.get('/users', async (req, res) => {
    const getUser = await User.find()
    res.json(getUser);
})

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body
    const userCreation = await User.create({
        username,
        email,
        password:bcrypt.hashSync(password, bcryptSecret),
    })
    res.json(userCreation)
})

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
                res.json('error password')
            }
        }
        else {
            res.json("Not found")
        }   
    }
    catch (e) {
        alert("error")
    }
    
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


app.listen('4000', console.log("Running on port 4000"));