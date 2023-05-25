import { React, useEffect, useState } from 'react'
import styles from "./Main.module.scss"
import Menu from '../Default/Menu/Menu';
import Footer from '../Default/Footer/Footer';

import Homepage from './Homepage/Homepage';
import Second from './Second/Second';
import axios from 'axios';


const Main = () => {

    const [usersList, setUsersList] = useState([])

useEffect(() => {

    const fetchUser =  async () => {
        const { data } = await axios.get('/users');
        console.log(data)
        setUsersList(data)
    }
    fetchUser();
}, []);


    return (
        <>
        <Menu/>
        <p>main</p>
        <Footer/>
        </>
    );
}

export default Main;