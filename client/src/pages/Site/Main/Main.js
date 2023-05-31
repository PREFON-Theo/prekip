import { React, useEffect, useState } from 'react'
import styles from "./Main.module.scss"
import Menu from '../Default/Menu/Menu';
import Footer from '../Default/Footer/Footer';
import axios from 'axios';


const Main = () => {

    const [usersList, setUsersList] = useState([])

useEffect(() => {

    const fetchUser =  async () => {
        const { data } = await axios.get('/users');
        setUsersList(data)
    }
    fetchUser();
}, []);


    return (
        <>
        <Menu/>
        <div className={styles.container}>
            <p>main</p>
        </div>
        <Footer/>
        </>
    );
}

export default Main;