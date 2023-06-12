import { React, useEffect, useState } from 'react'
import styles from "./Main.module.scss"
import Menu from '../Default/Menu/Menu';
import Footer from '../Default/Footer/Footer';
import Login from '../../Auth/Login';
import Homepage from "../Main/Homepage/Homepage"
import axios from 'axios';

import { Routes, Route } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import Account from './Account/Account';


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
                <Routes>
                    <Route index element={<Homepage/>}/>
                    <Route path="compte" element={<Account/>}/>
                </Routes>
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