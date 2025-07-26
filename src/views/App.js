import { ToastContainer } from 'react-toastify';
import './App.scss';
import Mycomponent from './example/Mycomponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import Login from '../routes/Login';
import Home from '../routes/Home';
import Nav from '../components/navbar';
import { AuthProvider } from '../routes/AuthContext';
import UserProfile from '../components/UserProfile';
import ListUsers from '../components/admin/ListUsers';

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
              <Route path="/helps" element={<div>Contact Page Coming Soon</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/dashboard" element={<Login />} />
              <Route path="/login/users" excact element={<ListUsers/>} />
              <Route path="/login/users/:id" element={<UserProfile />} />
              
              
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
