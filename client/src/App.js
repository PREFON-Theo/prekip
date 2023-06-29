import React, { useState } from 'react'
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './pages/Site/Main/Main';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/Errors/404/NotFound';

import Account from './pages/Site/Main/Account/Account';
import { UserContextProvider } from './utils/Context/UserContext/UserContext';
import Calendar from './pages/Site/Main/Calendar/Calendar';

import { createTheme, ThemeProvider } from '@mui/material';
import { frFR as coreFrFR } from '@mui/material/locale';
import { frFR } from '@mui/x-date-pickers/locales';

import NewArticle from './pages/Site/Main/Article/NewArticle/NewArticle';
import ArticlePage from './pages/Site/Main/Article/ArticlePage/ArticlePage';
import Signin from './pages/Auth/Signin'

import StatsPrefon from './pages/Site/Main/StatsPrefon/StatsPrefon';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Rubrique from './pages/Site/Main/Rubrique/Rubrique';
import EditArticle from './pages/Site/Main/Article/EditArticle/EditArticle';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

const theme = createTheme (
  frFR,
  coreFrFR,
)

const App = () => {

  const [openAlert, setOpenAlert] = useState(false);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');


  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const changeAlertValues = (type, msg) => {
    setAlertMsg(msg)
    setAlertType(type)
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
              {alertMsg}
            </Alert>
          </Snackbar>
          <Router>
            <Routes>

              <Route path='/' element={<Main handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}>
                <Route path='compte' element={<Account handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}>
                </Route>
                <Route path='/calendar' element={<Calendar handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/new-article' element={<NewArticle handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/article/:id' element={<ArticlePage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/edit-article/:id' element={<EditArticle handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/stats' element={<StatsPrefon/>}/>
                <Route path='/rubrique/:element' element={<Rubrique/>}/>
                <Route path='/*' element={<NotFound/>}/>
              </Route>

              <Route path='/admin' element={<Admin/>}/>
              <Route path='/register' element={<Signin/>}/>

            </Routes>

          </Router>
        </UserContextProvider>

      </ThemeProvider>
    </>
  );
}

export default App;
