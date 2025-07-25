import React from "react";
import "../styles/Nav.scss"
import logo from "../assets/logo.svg"
import { NavLink, NavNavLink} from "react-router-dom";
class Nav extends React.Component{
    render() {
        return (
            <>
            <div className="topnav">
            <NavLink to="/home" >Home</NavLink>
            <NavLink to="/user">Users</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/login " >Login</NavLink>
            </div>
            <img src={logo} className="App-logo" alt="logo" />
            </>
        )
    }
      
}

export default Nav;