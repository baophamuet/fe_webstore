import React, { useState, useRef, useEffect } from "react";
import "../styles/Nav.scss";
import logo from "../assets/images/logoweb-white.png";
import { NavLink } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaLock } from "react-icons/fa";

const userLogin = JSON.parse(localStorage.getItem("user")) || null;

export default function Nav({ onSearch }) {
  const [isFixed, setIsFixed] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navRef = useRef(null);
  const typingTimer = useRef(null);

  // lấy chiều cao nav khi mount
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }

    const handleScroll = () => {
      if (window.scrollY > navHeight && !isFixed) {
        setIsFixed(true);
      } else if (window.scrollY <= navHeight && isFixed) {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navHeight, isFixed]);

  // thay đổi input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      onSearch?.(value);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <div ref={navRef} className={`topnav ${isFixed ? "fixed" : ""}`}>
      {/* Logo section */}
      <div className="logo-section">
        <img src={logo} className="App-logo" alt="logo" />
        <NavLink className="logo" to="/home">SHOPPINK</NavLink>
        <img src={logo} className="App-logo" alt="logo" />
      </div>

      {/* Search bar */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </form>

      {/* Nav links */}
      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/helps">Help</NavLink>
        <NavLink to="/privacy"><FaLock className="icon" /></NavLink>
        <NavLink to="/login"><FaUser className="icon" /></NavLink>

        {userLogin ? (
          <NavLink to={`/users/${userLogin.id}/favorite`}>
            <FaHeart className="icon" />
          </NavLink>
        ) : (
          <NavLink to="/login">
            <FaHeart className="icon" />
          </NavLink>
        )}

        {userLogin ? (
          <NavLink to={`/users/${userLogin.id}/cart`}>
            <FaShoppingCart className="icon" />
          </NavLink>
        ) : (
          <NavLink to="/login">
            <FaShoppingCart className="icon" />
          </NavLink>
        )}
      </div>
    </div>
  );
}
