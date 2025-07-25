import logo from '../assets/logo.svg';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Mycomponent from './example/Mycomponent';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import ProductCard from '../components/ProductCard';
import Home from '../routes/Home';
import Nav from '../components/navbar';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <header className="App-header">
        <Nav></Nav>
        
        <Routes>
          <Route path='/about' >          </Route>
          <Route path='/'  element={<Mycomponent />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/contact' >          </Route>
          <Route path='/news' element={<ProductCard />}>          </Route>
        </Routes>
        <p>
          Hello world!!!
        </p>
        
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
  );
}

export default App;
