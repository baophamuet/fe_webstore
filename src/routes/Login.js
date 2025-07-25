import React, { useState } from 'react';
import '../styles/Login.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';


function Login() {
  const { login,logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userLogin= JSON.parse(localStorage.getItem('user'))
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };
  const handleChangeLogout = (e) =>{
    e.preventDefault();
    try {
      logout()
    }catch(e) {
      console.error('Login error:', e);
    }
  }
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log(">>>>>>> check data:  ", data);
      if (data.status) {
        setMessage('✅ Đăng nhập thành công!');
        await toast.success("Đăng nhập thành công!");
        localStorage.setItem('token', data.token);
        //console.log(">>>>>>> check data.user:  ", data);
        login({ username, password })
        console.log(">>>>>>> check data.user1:  ", { username, password });
         console.log(">>>>>>> check data.user2:  ", JSON.parse(localStorage.getItem('user')));

        setTimeout(() => {
          navigate('/home');
        }, 100);
      } else {
        setMessage(data.message);
        toast.error("Sai tài khoản/mật khẩu!");
      }
    } catch (error) {
      setMessage('Lỗi kết nối đến server!');
      console.error('Login error:', error);
      toast.error("Không thể đăng nhập!");
    }
  };
  if (!userLogin)
  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmitLogin}>
        <input
          type="text"
          name="username"
          placeholder="Tài khoản"
          value={username}
          onChange={handleChangeLogin}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={handleChangeLogin}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {message && <p className="message">{message}</p>}
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        closeButton={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
  else return (
     <div className="account-page">
      <h1 className="title">Tài khoản</h1>
      <div className="account-container">
        <div className="account-section">
          <h2>Thông tin tài khoản</h2>
          <hr />
          <p>Điểm Tích lũy của bạn: <strong>15</strong></p>
          <p>Cấp độ khách hàng: <strong>SILVER</strong></p>
          <p>Thay đổi thông tin tài khoản</p>
          <p>Thay đổi mật khẩu</p>
          <p className="logout" onClick={handleChangeLogout}><FaSignOutAlt /> Đăng xuất</p>
        </div>
        <div className="account-section">
          <h2>Sản phẩm yêu thích</h2>
          <hr />
          <p>Sản phẩm yêu thích</p>
          <p>Lịch sử order</p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        closeButton={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  )
}

export default Login;