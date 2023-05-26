import React, { useContext, useState } from 'react'
import styles from "./Login.module.scss"
import axios from 'axios';
import { Navigate } from "react-router-dom"
import { UserContext } from '../../../utils/Context/UserContext/UserContext';

const Login = () => {
    const [email, setEmail] = useState('theo@gmail.com');
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext)

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/login', {email, password})
            setUser(data);
            alert('Login successful');
            setRedirect(true);
        }
        catch (err) {
            alert("err")
        }
    }

    if(redirect) {
        return <Navigate to={'/'}/>
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