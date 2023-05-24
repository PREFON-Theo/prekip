import React, { useState } from 'react'
import styles from "./Signin.module.scss"
import axios from "axios";

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = (e) => {
        e.preventDefault();
        axios.post('/register', {
            username, password
        });
    }

    return (
        <>
        <form onSubmit={e => registerUser(e)}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <button>Submit</button>
        </form>
        </>
    );
}

export default Signin;