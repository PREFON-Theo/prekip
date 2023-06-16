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

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

const theme = createTheme (
  frFR,
  coreFrFR,
)

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <Router>
            <Routes>

              <Route path='/' element={<Main/>}>
                <Route path='compte' element={<Account/>}>
                </Route>
                <Route path='/calendar' element={<Calendar/>}/>

              </Route>
              <Route path='/admin' element={<Admin/>}/>
              <Route path='*' element={<NotFound/>}/>
              {/*<Route path='/calendrier' element={</>}/> TODO*/}
              {/*<Route path='/rubrique/:subpage?' element={</>}/> TODO*/}

            </Routes>

          </Router>
        </UserContextProvider>

      </ThemeProvider>
    </>
  );
}

export default App;
