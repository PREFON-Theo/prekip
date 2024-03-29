import React, { useContext, useEffect, useState } from 'react'
import styles from "./Account.module.scss"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';
import { Navigate } from 'react-router-dom';

import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import axios from 'axios';


const Account = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready, setUser, cookies} = useContext(UserContext)
  const [userInfor, setUserInfor] = useState({
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    divisions: []
  })
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [displayErrorPassword, setDisplayErrorPassword] = useState(false)

  const [rubriqueList, setRubriqueList] = useState();

  const fetchRubriques = async () => {
    const rubriquesRaw = await axios.get("/rubrique-type", {headers: {jwt: cookies.token}})
    setRubriqueList(rubriquesRaw.data)
  }

  useEffect(() => {
    fetchRubriques()
  }, [])

  useEffect(() => {
    setUserInfor({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      roles: user?.roles,
      divisions: user?.divisions
    })
  }, [user])

  
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
            }, {headers: {jwt: cookies.token}})
            handleOpenAlert()
            changeAlertValues("success", "Informations modifiées")
            setUser((usr) => ({...usr, 
              firstname: userInfor.firstname,
              lastname: userInfor.lastname
            }))
          }
        }
        else {
          setDisplayErrorPassword(true);
        }
      }
      else {
        if(user._id){
          axios.patch(`/user/${user?._id}`, userInfor, {headers: {jwt: cookies.token}})
          handleOpenAlert()
          changeAlertValues("success", "Informations modifiées")
          setUser((usr) => ({...usr, 
            firstname: userInfor.firstname,
            lastname: userInfor.lastname
          }))
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
        <div className={styles.one}>
          {userInfor.roles.length === 0 ? '' : userInfor.roles.length === 1 ? `Rôle: ${userInfor.roles}` : `Rôles: ${userInfor.roles}`}
        </div>
        <div className={styles.one}>
          {
            userInfor.divisions.length === 0 
            ?
              ''
            :
             userInfor.divisions.length === 1 
             ?
              `Pôle: ${userInfor.divisions.map((userInfor) => rubriqueList?.filter((rl) => rl._id === userInfor)[0]?.title)}` 
              :
               `Pôles: ${userInfor.divisions.map((userInfor) => rubriqueList?.filter((rl) => rl._id === userInfor)[0]?.title)}`
          }
          
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