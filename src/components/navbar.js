import React from "react";
import "../styles/Nav.scss"
import logo from "../assets/images/logo.svg"
import { NavLink, NavNavLink} from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';

class Nav extends React.Component{
    render() {
        return (
            <>
      <div className="topnav">
      <img src={logo} className="App-logo" alt="logo" />
      <NavLink  className="logo" to="/home">SHOPPINK</NavLink>
      
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Tìm kiếm" />
      </div>

      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/helps">Help</NavLink>
        <NavLink to="/login"><FaUser className="icon" /></NavLink>
        <FaHeart className="icon" />
        <FaShoppingCart className="icon" />
      </div>
    </div>
            
            </>
        )
    }
      
}

export default Nav;