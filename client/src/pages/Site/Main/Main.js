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
import Calendar from './Calendar/Calendar';
import NewArticle from './Article/NewArticle/NewArticle';
import ArticlePage from './Article/ArticlePage/ArticlePage';
import StatsPrefon from './StatsPrefon/StatsPrefon';


const Main = ({ handleOpenAlert, changeAlertValues }) => {

    const [usersList, setUsersList] = useState([])

useEffect(() => {

    const fetchUser =  async () => {
        const { data } = await axios.get('/users')
        setUsersList(data)
    }
    fetchUser();
}, []);

/*useEffect(() => {
    console.log(usersList)
}, [usersList])*/

const [openLoginForm, setOpenLoginForm] = useState(false);
const handleCloseLoginForm = () => {
    setOpenLoginForm(false);
};
const handleOpenLoginForm = () => {
    setOpenLoginForm(true);
};



    return (
        <>
            <Menu handleOpenLoginForm={handleOpenLoginForm}  handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>

            <div className={styles.container}>
                <Routes>
                    <Route index element={<Homepage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path="compte" element={<Account handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path="calendar" element={<Calendar handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues} handleOpenLoginForm={handleOpenLoginForm}/>}/>
                    <Route path='new-article' element={<NewArticle handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='article/:id' element={<ArticlePage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='stats' element={<StatsPrefon/>}/>
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
                    <Login setOpenLoginForm={setOpenLoginForm} handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>
                    
                </Dialog>
            </div>
        </>
    );
}

export default Main;