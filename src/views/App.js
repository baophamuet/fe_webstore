import logo from '../assets/logo.svg';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Mycomponent from './example/Mycomponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import Login from '../routes/Login';
import Home from '../routes/Home';
import Nav from '../components/navbar';
import { AuthProvider } from '../routes/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Nav />
            <Routes>
              <Route path="/" element={<Mycomponent />} />
              <Route path="/home" element={<Home />} />
              <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </header>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
