import { React, useEffect, useState } from 'react'
import styles from "./Main.module.scss"
import Menu from '../Default/Menu/Menu';
import Footer from '../Default/Footer/Footer';
import Login from '../../Auth/Login';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';


const Main = () => {

    const [usersList, setUsersList] = useState([])

useEffect(() => {

    const fetchUser =  async () => {
        const { data } = await axios.get('/users');
        setUsersList(data)
    }
    fetchUser();
}, []);

const [openLoginForm, setOpenLoginForm] = useState(false);
const handleCloseLoginForm = () => {
    setOpenLoginForm(false);
  };
  const handleOpenLoginForm = () => {
    setOpenLoginForm(true);
  };



    return (
        <>
            <Menu handleOpenLoginForm={handleOpenLoginForm}/>
            <div className={styles.container}>
                <p>main</p>
            </div>
            <Footer/>

            <div className={styles.login_form}>


                <Dialog
                    open={openLoginForm}
                    onClose={handleCloseLoginForm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Login setOpenLoginForm={setOpenLoginForm}/>
                    
                </Dialog>              
            </div>
        </>
    );
}

export default Main;