import React from 'react'
import styles from "./Auth.module.scss"
import Login from './Login/Login';
import Signin from './Signin/Signin';

const Auth = () => {
    return (
        <>
        Auth
        <Login/>
        <Signin/>
        </>
    );
}

export default Auth;