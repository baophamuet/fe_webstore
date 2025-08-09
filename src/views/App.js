import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import Mycomponent from './example/Mycomponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../routes/Login';
import Home from '../routes/Home';
import Nav from '../components/navbar';
import { AuthProvider } from '../routes/AuthContext';
import UserProfile from '../components/UserProfile';
import ListUsers from '../components/admin/ListUsers';
import RegisterForm from '../routes/RegisterForm';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';

function App() {
  return (
    <AuthProvider>
      
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Mycomponent />} />
              <Route path="/home" element={<Home />} />
              <Route path="/helps" element={<div>Contact Page Coming Soon</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/dashboard" element={<Login />} />
              <Route path="/login/users" excact element={<ListUsers/>} />
              <Route path="/login/users/:id" element={<UserProfile />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/products/:ProductId" element={<ProductDetail />} />

              
            </Routes>
            
          </header>
          <Footer />
        </div>
      </BrowserRouter>
                <ToastContainer 
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
    </AuthProvider>
  );
}

export default App;
