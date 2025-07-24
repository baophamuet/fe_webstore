import logo from '../assets/logo.svg';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Mycomponent from './example/Mycomponent';
import Login from './example/loginComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello world!!!
        </p>
        <Mycomponent></Mycomponent>
      </header>
      <Login></Login>
      <ToastContainer 
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

    </div>
  );
}

export default App;
