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


axios.defaults.baseURL = 'http://localhost:4000'

function App() {
  return (
    <>
        <Router>
          <Routes>

            <Route path='/' element={<Main/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/auth' element={<Auth/>}/>
            <Route path='*' element={<NotFound/>}/>

          </Routes>

        </Router>
    </>
  );
}

export default App;
