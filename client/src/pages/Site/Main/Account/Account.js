import React, { useContext, useEffect, useState } from 'react'
import styles from "./Account.module.scss"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';
import { Navigate } from 'react-router-dom';

import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import axios from 'axios';


const Account = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready, setUser} = useContext(UserContext)
  const [userInfor, setUserInfor] = useState({
    firstname: "",
    lastname: "",
    email: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [displayErrorPassword, setDisplayErrorPassword] = useState(false)


  useEffect(() => {
    setUserInfor({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email
    })
  }, [user])

  useEffect(() => {
    console.log(ready)
  }, [ready])

  
  if(ready === "waiting") {
    return 'Chargement...';
  }


  if(ready === "no") {
    return <Navigate replace to={"/"}/>
  }


  const handleSumbitChanges = () => {
    try {
      setDisplayErrorPassword(false);
      if(password !== ''){
        if(password === confirmPassword) {
          if(user._id){
            axios.patch(`/user/${user?._id}`, {
              ...userInfor,
              password: password
            })
            handleOpenAlert()
            changeAlertValues("success", "Informations modifiées")
            setUser({
              firstname: userInfor.firstname,
              lastname: userInfor.lastname
            })
          }
        }
        else {
          setDisplayErrorPassword(true);
        }
      }
      else {
        console.log(userInfor)
        if(user._id){
          axios.patch(`/user/${user?._id}`, userInfor)
          handleOpenAlert()
          changeAlertValues("success", "Informations modifiées")
          setUser({
            firstname: userInfor.firstname,
            lastname: userInfor.lastname
          })
        }
      }
      
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues("error", "Erreur: " + err)
    }
  }


  return (
    <>
      <div className={styles.container}>
        <h1>Mes informations</h1>
        <div className={styles.one}>
          <TextField value={userInfor.firstname} label="Prénom" variant="outlined" onChange={e => setUserInfor(prevValues => ({...prevValues, firstname: e.target.value}) )} sx={{width: '100%'}}/>
        </div>
        <div className={styles.one}>
          <TextField value={userInfor.lastname} label="Nom" variant="outlined" onChange={e => setUserInfor(prevValues => ({...prevValues, lastname: e.target.value}) )} sx={{width: '100%'}}/>
        </div>
        <div className={styles.one}>
          <TextField value={userInfor.email} label="Adresse mail" type='email' variant="outlined" onChange={e => setUserInfor(prevValues => ({...prevValues, email: e.target.value}) )} sx={{width: '100%'}}/>
        </div>

        <div className={styles.one_password}>
          <TextField value={password} error={displayErrorPassword} label="Mot de passe" type='password' variant="outlined" onChange={e => setPassword(e.target.value)} sx={{width: '100%'}}/>
        </div>
        <div className={styles.one}>
          <TextField value={confirmPassword} error={displayErrorPassword} label="Confirmation de mot de passe" type='password' variant="outlined" onChange={e => setConfirmPassword(e.target.value)} sx={{width: '100%'}}/>
        </div>
        <div style={{ display: displayErrorPassword ? 'block' : 'none', color: 'red' }}>Le mot de passe et la confirmation ne correspondent pas</div>

        <div className={styles.two}></div>
        <div className={styles.button}>
            <Button variant="contained" color='warning' onClick={handleSumbitChanges}>Modifiier</Button>
        </div>
      </div>
    </>
  );
}

export default Account;