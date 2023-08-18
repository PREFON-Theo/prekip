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
import Forum from './pages/Site/Main/Forum/ForumPage/Forum';
import NewForum from './pages/Site/Main/Forum/NewForum/NewForum';
import EditForum from './pages/Site/Main/Forum/EditForum/EditForum';
import EditHomeLinks from './pages/Site/Main/Homepage/HomeLinks/EditHomeLinks/EditHomeLinks';
import Search from './pages/Site/Main/Search/Search';
import ListUsers from './pages/Admin/Main/User/ListUsers';
import UserPage from './pages/Admin/Main/User/UserPage';
import ListContents from './pages/Admin/Main/Content/ListContents';
import NotFoundAdmin from './pages/Admin/Errors/404/NotFoundAdmin';
import NewUser from './pages/Admin/Main/User/NewUser';
import ListForums from './pages/Admin/Main/Forum/ListForums';
import ListEvents from './pages/Admin/Main/Events/ListEvents';
import ListRubriqueType from './pages/Admin/Main/Content/RubriqueType/ListRubriqueType';
import ListComments from './pages/Admin/Main/Content/Comments/ListComments';
import ListAnswers from './pages/Admin/Main/Forum/Answers/ListAnswers';
import NewRubrique from './pages/Admin/Main/Content/RubriqueType/NewRubrique';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

axios.defaults.baseURL = `${process.env.REACT_APP_URL}:4000`
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
                <Route path='/forum' element={<Forum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/new-forum' element={<NewForum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/edit-forum/:id' element={<EditForum handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/edit-static-link/' element={<EditHomeLinks handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/search' element={<Search handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path='/*' element={<NotFound/>}/>
              </Route>

              <Route path='/admin' element={<Admin handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}>
                <Route path="/admin/user/list" element={<ListUsers handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/user/page/:id" element={<UserPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/user/new/" element={<NewUser handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/content/list" element={<ListContents handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/forum/list" element={<ListForums handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/event/list" element={<ListEvents handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/rubrique-type/list" element={<ListRubriqueType handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/rubrique-type/new" element={<NewRubrique handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/comment/list" element={<ListComments handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/answer/list" element={<ListAnswers handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
                <Route path="/admin/*" element={<NotFoundAdmin/>}/>
              </Route>
              <Route path='/register' element={<Signin handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>

            </Routes>

          </Router>
        </UserContextProvider>

      </ThemeProvider>
    </>
  );
}

export default App;
