import React, { useState } from 'react'
import styles from "./Login.module.scss"
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('theo@gmail.com');
    const [username, setusername] = useState('thea');
    const [password, setPassword] = useState('root');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/login', {email, password}, {withCredentials: true})
            alert('Login successful')
        }
        catch (err) {
            alert("err")
        }
    }

    return (
        <>
        login
        <form onSubmit={(e) => handleLoginSubmit(e)}>
            <input type="text" value={email} placeholder="email" onChange={e => setEmail(e.target.value)}/>
            <input type="password" value={password} placeholder="password" onChange={e => setPassword(e.target.value)}/>
            <button>Submit</button>
        </form> 
        </>
    );
}

export default Login;