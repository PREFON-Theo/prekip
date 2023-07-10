const express = require('express');
const router = express.Router();
const User = require('../models/User')

const bcrypt = require('bcryptjs');
const bcryptSecret = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const jwtSecret = 'JNaZcAPqBr4dPqiMhwavDjZCgABEQKLJyj6Cq8aJukvoXGHi'


//Get All Users - OK
router.get('/', async (req, res) => {
  const getUser = await User.find()
  res.json(getUser);
})

//Update one event - OK
router.patch('/:id', (req, res) => {
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
router.post('/register', async (req, res) => {
  try {
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
    res.status(200).json(userCreation)
  }
  catch (error) {
      res.status(400).json({
          error: error
      });
  }
})

//Connexion - OK
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const userInfo = await User.findOne({email});
    if(userInfo) {
      const checkPwd = bcrypt.compareSync(password, userInfo.password)
      console.log(checkPwd)
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
router.post('/logout', async (req, res) => {
  res.cookie('token', '').json('ok');
})

router.get('/profil', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;