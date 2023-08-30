import { useState } from 'react'
import styles from "./Main.module.scss"
import Menu from '../Default/Menu/Menu';
import Footer from '../Default/Footer/Footer';
import Login from '../../Auth/Login';
import Homepage from "../Main/Homepage/Homepage"

import { Routes, Route } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import Account from './Account/Account';
import Calendar from './Calendar/Calendar';
import NewArticle from './Article/NewArticle/NewArticle';
import StatsPrefon from './StatsPrefon/StatsPrefon';
import Rubrique from './Rubrique/Rubrique';
import NotFound from '../../Errors/404/NotFound';
import EditArticle from './Article/EditArticle/EditArticle';
import Forum from './Forum/ForumPage/Forum';
import NewForum from './Forum/NewForum/NewForum';
import EditForum from './Forum/EditForum/EditForum';
import EditHomeLinks from './Homepage/HomeLinks/EditHomeLinks/EditHomeLinks';
import Search from './Search/Search';

import ContentPage from "./Article/ContentPage/ContentPage"
import Actualities from './Actualities/Actualities';


const Main = ({ handleOpenAlert, changeAlertValues }) => {

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
                    <Route path='article/:id' element={<ContentPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='actuality/:id' element={<ContentPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='reference/:id' element={<ContentPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='edit-article/:id' element={<EditArticle handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='stats' element={<StatsPrefon/>}/>
                    <Route path='rubrique/:element' element={<Rubrique/>}/>
                    <Route path='actuality-list' element={<Actualities/>}/>
                    <Route path='forum' element={<Forum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='new-forum' element={<NewForum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='edit-forum/:id' element={<EditForum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='edit-static-link' element={<EditHomeLinks handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='search' element={<Search handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                    <Route path='/*' element={<NotFound/>}/>
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