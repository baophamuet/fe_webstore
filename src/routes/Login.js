import React, { useState } from 'react';
import '../styles/Login.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import Admin from './Admin';
import UserProfile from '../components/UserProfile';


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

  const handleClickRegister = () =>{
    navigate('/register')
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
        //setMessage('✅ Đăng nhập thành công!');
        localStorage.setItem('token', data.token);
        let role = data.status.role
        let id  = data.status.id
        //console.log(">>>>>>> check data.user:  ", data);
        login({username,role,id})
        console.log(">>>>>>> check data.user1:  ", { username, password });
         console.log(">>>>>>> check data.user2:  ", JSON.parse(localStorage.getItem('user')));
        if (role!='admin'){
          setTimeout(() => {
          navigate('/home');
        }, 100);
        }
        toast.success("Đăng nhập thành công!");

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
      <hr></hr>
      <button  type="submit" onClick={()=>{handleClickRegister()}}
      >Đăng ký</button>
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
  else if (userLogin.role=='admin') {
    return (
      <Admin></Admin>
    )
  }
  else return (
     <div className="account-page">
      <h1 className="title">Tài khoản</h1>
      <div className="account-container">
        <div className="account-section">
          <h2>Thông tin tài khoản</h2>
          <hr />
          <UserProfile></UserProfile>

        </div>
        <div className="account-section">
          <h2>Sản phẩm yêu thích</h2>
          <hr />
          <p className='account-section-tym'>Sản phẩm yêu thích</p>
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