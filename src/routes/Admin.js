import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { useAuth } from './AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import Dashboard from "../components/admin/Dashboard";

export default function Admin() {
      const {logout,user } = useAuth();
     const navigate = useNavigate();
      console.log("Checkkk userLogin:      ", user  )
      const handleChangeLogout = (e) =>{
          e.preventDefault(); // chặn gọi lại từ form
    try {
      logout()
      navigate('/login')
    }catch(e) {
      console.error('Login error:', e);
    }
  }
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
        <h3 className="text-center">ADMIN</h3>
        <ul className="nav flex-column mt-4">
          <li className="nav-item"><a className="nav-link text-white" href="/login/dashboard">Dashboard</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Tables</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Charts</a></li>
          <li className="nav-item"><a className="nav-link text-white"  
          href={ (user) ? `/login/users/${user.id}` :`/login/user/`}>Account</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="/login/users">List Users</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Settings</a></li>
          <p className="logout" onClick={handleChangeLogout}><FaSignOutAlt /> Đăng xuất</p>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f0f2f5" }}>
        <h2 className="mb-4">Dashboard</h2>

        <Dashboard></Dashboard>

      </div>
    </div>
  );
}
