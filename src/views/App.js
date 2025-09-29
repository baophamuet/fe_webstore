import { ToastContainer } from 'react-toastify';
import React, { useState } from "react";
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
import Favorite from '../routes/Favorite';
import Cart from '../routes/Cart';
import Privacy from "../routes/Privacy";
import HelpPage from "../routes/HelpPage";
import Order from '../routes/Orders';
import Orders from '../routes/Orders';
import OrderDetail from '../routes/OrderDetail';
import OrderCheckout from '../routes/OrderCheckout';
// ...
<Route path="/privacy" element={<Privacy />} />

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthProvider>
      
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Nav onSearch={setSearchQuery}/>
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/test" element={<Mycomponent />} />
              <Route path="/home" element={<Home searchQuery={searchQuery}/>} />
              <Route path="/helps" element={<HelpPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/dashboard" element={<Login />} />
              <Route path="/login/users" excact element={<ListUsers/>} />
              <Route path="/login/users/:id" element={<UserProfile />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/products/:ProductId" element={<ProductDetail />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/users/:id/orders" excact element={<Orders />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/helps" element={<HelpPage />} />
              <Route path="/users/orders/:id" excact element={<OrderDetail />} />
              <Route path="/ordercheckout" excact element={<OrderCheckout />} />

              
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
