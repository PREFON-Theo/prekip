const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('./models/User');
require('dotenv').config();

const bcryptSecret = bcrypt.genSaltSync(10)


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


app.get('/test', (req, res) => {
    res.json('test ok');
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body
    const userCreation = await User.create({
        username,
        password:bcrypt.hashSync(password, bcryptSecret),
    })
    res.json(userCreation)
})

app.listen('4000', console.log("Running on port 4000"));