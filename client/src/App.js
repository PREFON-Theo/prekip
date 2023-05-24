import axios from 'axios';
import './App.css';
import Login from './pages/Auth/Login/Login';
import Signin from './pages/Auth/Signin/Signin';

axios.defaults.baseURL = 'http://localhost:4000'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Signin/>
      </header>
    </div>
  );
}

export default App;
