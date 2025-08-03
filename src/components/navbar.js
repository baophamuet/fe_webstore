import React from "react";
import "../styles/Nav.scss";
import logo from "../assets/images/logoweb-white.png";
import { NavLink } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';

class Nav extends React.Component {
  render() {
    return (
      <div className="topnav">
        {/* Logo section - Bên trái */}
        <div className="logo-section">
          <img src={logo} className="App-logo" alt="logo" />
          <NavLink className="logo" to="/home">SHOPPINK</NavLink>
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        {/* Search bar - Giữa (hoặc sát nav-links) */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm" />
        </div>

        {/* Nav links - Bên phải */}
        <div className="nav-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/helps">Help</NavLink>
          <NavLink to="/login"><FaUser className="icon" /></NavLink>
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
        </div>
      </div>
    );
  }
}

export default Nav;