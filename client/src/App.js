import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './pages/Site/Main/Main';
import Admin from './pages/Admin/Admin';
import Auth from './pages/Auth/Auth';
import NotFound from './pages/Errors/404/NotFound';

import Menu from './pages/Site/Default/Menu/Menu';
import Footer from './pages/Site/Default/Footer/Footer';
import Homepage from './pages/Site/Main/Homepage/Homepage';
import Second from './pages/Site/Main/Second/Second';
import Account from './pages/Site/Main/Account/Account';
import { UserContextProvider } from './utils/Context/UserContext/UserContext';


axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Router>
          <Routes>

            <Route path='/' element={<Main/>}/>
            <Route path='/compte/:subpage?' element={<Account/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/auth' element={<Auth/>}/>
            <Route path='*' element={<NotFound/>}/>
            {/*<Route path='/calendrier' element={</>}/> TODO*/}
            {/*<Route path='/rubrique/:subpage?' element={</>}/> TODO*/}

          </Routes>

        </Router>
      </UserContextProvider>
    </>
  );
}

export default App;
