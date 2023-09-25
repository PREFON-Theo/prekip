const express = require('express');
const router = express.Router();
const User = require('../models/User')

const bcrypt = require('bcryptjs');
const bcryptSecret = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET


//Get All Users - OK
router.get('/', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else {
          const getUser = await User.find();
          let userList = [];
          getUser.map((item) => {
            userList.push({
              _id : item._id,
              firstname: item.firstname,
              lastname: item.lastname,
              email: item.email,
              roles: item.roles,
              joiningDate: item.joiningDate,
              leavingDate: item.leavingDate,
              valid: item.valid,
              divisions: item.divisions
            })
          })
          res.status(200).json(userList);
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
    res.status(400).json(error)
  }

})


//Get one
router.get('/one/:id', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          
          const UserInfo = await User.findOne({_id: req.params.id})
          res.status(200).json({
            firstname: UserInfo.firstname,
            lastname: UserInfo.lastname,
            email: UserInfo.email,
            roles: UserInfo.roles,
            joiningDate: UserInfo.joiningDate,
            leavingDate: UserInfo.leavingDate,
            valid: UserInfo.valid,
            divisions: UserInfo.divisions
          })
          
        }
        else {
          res.status(403).json('Unauthorized')
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (e){
      res.status(400).json(e)
  }
})


//Get profil - ok
router.get('/profil', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token && token !== '') {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        const {_id, firstname, lastname, email, roles, joiningDate, leavingDate, valid, divisions} = await User.findById(user.id); 
        res.json({_id, firstname, lastname, email, roles, joiningDate, leavingDate, valid, divisions})
      })
    }
    else {
      res.json(null)
    }
  }
  catch (error) {
    res.status(400).json(error);
  }
})

//Get stats
router.get('/stats', async (req, res) => {
  try {

    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          
          const getRoleModo = await User.find({roles: 'Modérateur'})
          const getRoleAdmin = await User.find({roles: 'Administrateur'})
          const getUsersLength = await User.find();
      
          res.json({
            user: getUsersLength.length - (getRoleAdmin.length + getRoleModo.length),
            modo: getRoleModo.length,
            admin: getRoleAdmin.length,
            total: getUsersLength.length
          })
  
        }
        else {
          res.status(403).json('Unauthorized')
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }

  }
  catch (err) {
    res.status(400).json(err);
  }
})

//Update one user - OK - JWT OK
router.patch('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur') || user.id === req.params.id){
  
          if(req.body.password){
              req.body.password = bcrypt.hashSync(req.body.password, bcryptSecret)
          }
          
          let body = req.body

          if(!user.roles.includes('Administrateur')){
            delete body.roles
            delete body.divisions
            delete body.joiningDate
            delete body.leavingDate
            delete body.valid
          }
          User.updateOne({_id: req.params.id}, body).then(() => {
              res.status(200).json({
                  message: `User ${req.params.id} updated`
              })
          })
          
        }
        else {
          res.status(403).json('Unauthorized')
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
      res.status(400).json(error);
  }
})

//Inscription - OK - OK JWT - TODO Test Front
router.post('/register', async (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token){
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){
          const {firstname, lastname, email, password, roles, joiningDate, leavingDate, valid, divisions} = req.body
          const findEmailUsed = await User.findOne({email: email})
          if(findEmailUsed === null){
            const userCreation = await User.create({
                firstname,
                lastname,
                email,
                password:bcrypt.hashSync(password, bcryptSecret),
                roles,
                joiningDate,
                leavingDate,
                valid,
                divisions
            })
            res.status(200).json(userCreation)
          }
          else {
            res.status(409).json("Email already used")
          }
        }
        else {
          res.status(403).json('Unauthorized')
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
      res.status(400).json(error);
  }
})

//Connexion - OK
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const userInfo = await User.findOne({email});
    if(userInfo) {
      if(!userInfo.valid){
        res.json('Invalid account')
      }
      else {
        const checkPwd = bcrypt.compareSync(password, userInfo.password)
        if(checkPwd) {
          jwt.sign({id: userInfo._id, roles: userInfo.roles}, jwtSecret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json(userInfo)
          })
        }
        else {
          res.json('Error password')
        }
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

//Delete User - OK - OK JWT
router.delete('/:id', (req, res) => {
  try {
    const token = req.headers.jwt;
    if(token) {
      jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err || user.id === undefined) {
          return res.status(403).json("Unauthorized")
        }
        else if(user.roles.includes('Administrateur')){

          User.deleteOne({_id: req.params.id}).then(() => {
              res.status(200).json({
                  message: `User ${req.params.id} deleted`
              })
          }).catch((error) => {
              res.status(400).json({
                  error: error
              });
          });

        }
        else {
          res.status(403).json('Unauthorized')
        }
      })
    }
    else {
      res.status(401).json("JSON Web Token not found")
    }
  }
  catch (error) {
      res.status(400).json(error);
  }
})

module.exports = router;