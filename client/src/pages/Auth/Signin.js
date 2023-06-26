import React, { useContext, useState } from 'react'
import styles from "./Login.module.scss"
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const Signin = () => {
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
            axios.post('/register', userInfo)
        }
        catch (err) {
            console.log(err)
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

                    {/* <div className={styles.input_mail}>
                        <TextField 
                            value={userInfo.role}
                            sx={{marginRight: '1vw'}}
                            label="Role"
                            variant="outlined"
                            onChange={e => setUserInfo((prevValue) => ({...prevValue, role: e.target.value}))}
                        />
                    </div>


                    <div className={styles.input_mail}>
                        <TextField 
                            value={userInfo.joiningDate}
                            sx={{marginRight: '1vw'}}
                            label="Date d'arrivé dans l'entreprise"
                            variant="outlined"
                            onChange={e => setUserInfo((prevValue) => ({...prevValue, joiningDate: e.target.value}))}
                        />
                    </div>


                    <div className={styles.input_mail}>
                        <TextField 
                            value={userInfo.leavingDate}
                            sx={{marginRight: '1vw'}}
                            label="Date de départ de l'entreprise"
                            variant="outlined"
                            onChange={e => setUserInfo((prevValue) => ({...prevValue, leavingDate: e.target.value}))}
                        />
                    </div>

                    <div className={styles.input_mail}>
                        <TextField 
                            value={userInfo.valid}
                            sx={{marginRight: '1vw'}}
                            label="Valid"
                            variant="outlined"
                            onChange={e => setUserInfo((prevValue) => ({...prevValue, valid: e.target.value}))}
                        />
                    </div> */}

                    
                    <div className={styles.button}>
                        <Button variant="contained" color='success' onClick={HandleSigninForm}>Connexion</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signin;