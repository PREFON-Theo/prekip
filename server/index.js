const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const bcryptSecret = bcrypt.genSaltSync(10);
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected"))
    .catch(()=> console.log("Not connected"))


const app = express();

app.use(express.json())
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
                jwt.sign({id: userInfo._id, email:userInfo.email, username:userInfo.username}, jwtSecret, {}, (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token).json("good password")

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


app.listen('4000', console.log("Running on port 4000"));