import React, { useState } from 'react'
import styles from "./Signin.module.scss"
import axios from "axios";

const Signin = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/register', {
                username, email, password
            });
            alert("Register successful")
        }
        catch (err) {
            alert(err)
        }
    }


    return (
        <>
        signin
        <form onSubmit={e => registerUser(e)}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <input type="mail" value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <button>Submit</button>
        </form> 
        </>
    );
}

export default Signin;