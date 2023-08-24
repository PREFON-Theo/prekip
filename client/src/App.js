import React, { useState } from 'react'
import axios from 'axios';
import './App.css';
import { UserContextProvider } from './utils/Context/UserContext/UserContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material';
import { frFR as coreFrFR } from '@mui/material/locale';
import { frFR } from '@mui/x-date-pickers/locales';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Main from './pages/Site/Main/Main';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/Errors/404/NotFound';
import NotFoundAdmin from './pages/Admin/Errors/404/NotFoundAdmin';

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
                <Route path='/*' element={<NotFound/>}/>
              </Route>

              <Route path='/admin' element={<Admin handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}>
                <Route path="/admin/*" element={<NotFoundAdmin/>}/>
              </Route>

            </Routes>

          </Router>
        </UserContextProvider>

      </ThemeProvider>
    </>
  );
}

export default App;
