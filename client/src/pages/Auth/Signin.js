import React, { useState } from 'react'
import styles from "./Login.module.scss"
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const Signin = ({handleOpenAlert, changeAlertValues}) => {
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
    joiningDate: "",
    leavingDate: "",
    valid: true
  })
      
  const HandleSigninForm = async () => {
    try {
      await axios
        .post('/user/register', userInfo)
        .then(() => handleOpenAlert())
        .then(() => changeAlertValues('success', 'Compte créé'))
    }
    catch (err) {
      console.log(err)
      handleOpenAlert()
      changeAlertValues('error', 'Erreur lors de la création')
    }
  }
    
    
  return (
    <>
      <div className={styles.container}>
        <h1>
          Création de compte :
        </h1>
          <div className={styles.container_inputs}>
            <div className={styles.input_mail}>
              <TextField 
                value={userInfo.firstname}
                sx={{marginRight: '1vw'}}
                label="Prénom"
                variant="outlined"
                onChange={e => setUserInfo((prevValue) => ({...prevValue, firstname: e.target.value}))}
              />
            </div>

            <div className={styles.input_mail}>
              <TextField 
                value={userInfo.lastname}
                sx={{marginRight: '1vw'}}
                label="Nom"
                variant="outlined"
                onChange={e => setUserInfo((prevValue) => ({...prevValue, lastname: e.target.value}))}
              />
            </div>

            <div className={styles.input_mail}>
              <TextField 
                value={userInfo.email}
                type='mail'
                sx={{marginRight: '1vw'}}
                label="Adresse mail"
                variant="outlined"
                onChange={e => setUserInfo((prevValue) => ({...prevValue, email: e.target.value}))}
              />
            </div>

            <div className={styles.input_mail}>
              <TextField 
                value={userInfo.password}
                type='password'
                sx={{marginRight: '1vw'}}
                label="Mot de passe"
                variant="outlined"
                onChange={e => setUserInfo((prevValue) => ({...prevValue, password: e.target.value}))}
              />
            </div>
              
            <div className={styles.button}>
              <Button variant="contained" color='success' onClick={HandleSigninForm}>Connexion</Button>
            </div>
          </div>
      </div>
    </>
  );
}

export default Signin;