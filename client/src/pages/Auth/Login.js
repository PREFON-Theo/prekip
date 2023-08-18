import React, { useContext, useState } from 'react'
import styles from "./Login.module.scss"
import axios from 'axios';
import { Navigate } from "react-router-dom"
import { UserContext } from '../../utils/Context/UserContext/UserContext';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const Login = ({setOpenLoginForm, handleOpenAlert, changeAlertValues}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser, setReady} = useContext(UserContext)

    
    const handleLoginSubmit = async () => {
        try {
            const {data} = await axios.post('/user/login', {email, password})
            if(data === 'Not found' || data === "Error password") {
                handleOpenAlert();
                changeAlertValues('error', "Mail ou mot de passe incorrect");
            }
            else {
                setUser(data);
                handleOpenAlert();
                changeAlertValues('success', "Vous êtes connecté");
                setOpenLoginForm(false);
                setRedirect(true)
                setReady("yes")
            }
        }
        catch (err) {
            handleOpenAlert();
            changeAlertValues('error', "Erreur de connection");
        }
    }
    
    if(redirect) {
        return <Navigate to={'/'}/>
    }

    
    return (
        <>
            <div className={styles.container}>
                <h1>
                    Connectez-vous :
                </h1>
                <div className={styles.container_inputs}>
                    <div className={styles.input_mail}>
                        <TextField value={email} sx={{marginRight: '1vw'}} label="Adresse mail" variant="outlined" onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className={styles.input_password}>
                        <TextField value={password} sx={{marginRight: '1vw'}} type="password" label="Mot de passe" variant="outlined" onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div className={styles.button}>
                        <Button variant="contained" color='success' onClick={handleLoginSubmit}>Connexion</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;