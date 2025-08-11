import React from "react";
import "../styles/Nav.scss";
import logo from "../assets/images/logoweb-white.png";
import { NavLink } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';

const userLogin= JSON.parse(localStorage.getItem('user')) || null;
class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFixed: false,
      navHeight: 0
    };
    this.navRef = React.createRef();
  }
   

  componentDidMount() {
    if (this.navRef.current) {
      this.setState({ navHeight: this.navRef.current.offsetHeight });
    }
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { navHeight, isFixed } = this.state;

    if (window.scrollY > navHeight && !isFixed) {
      this.setState({ isFixed: true });
    } else if (window.scrollY <= navHeight && isFixed) {
      this.setState({ isFixed: false });
    }
  };

  render() {
    return (
      <div
        ref={this.navRef}
        className={`topnav ${this.state.isFixed ? "fixed" : ""}`}
      >
        {/* Logo section */}
        <div className="logo-section">
          <img src={logo} className="App-logo" alt="logo" />
          <NavLink className="logo" to="/home">SHOPPINK</NavLink>
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm" />
        </div>

        {/* Nav links */}
        <div className="nav-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/helps">Help</NavLink>
          <NavLink to="/login"><FaUser className="icon" /></NavLink>
          {
            (userLogin!== null)
            ? <NavLink to={`/users/${userLogin.id}/favorite`}> <FaHeart className="icon" /></NavLink>
            : <NavLink to={`/users/:null/favorite`}> <FaHeart className="icon" /></NavLink>
          }
          {
            (userLogin!== null)
            ? <NavLink to={`/users/${userLogin.id}/cart`}> <FaShoppingCart className="icon" /></NavLink>
            : <NavLink to={`/users/:null/cart`}> <FaShoppingCart className="icon" /></NavLink>
          }
          
        </div>
      </div>
    );
  }
}

export default Nav;
