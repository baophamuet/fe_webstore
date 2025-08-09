import React, { useState,useEffect  } from 'react';
import '../styles/Login.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import Admin from './Admin';
import UserProfile from '../components/UserProfile';
import { jwtDecode } from 'jwt-decode';


const server = process.env.REACT_APP_API_URL;
function Login() {
  const { login,logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  

  const userLogin= JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi
  }, [pathname]);
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
      const response = await fetch(`${server}/login`, {
        method: 'POST',
        credentials: 'include', //  cookie đính kèm
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });


      const data = await response.json();
      console.log(">>>>>>> check data:  ", data);
     

      if (response.ok && data.status && data.token) {
        //setMessage('✅ Đăng nhập thành công!');


        const userdecoded = jwtDecode(data.token);
        

        console.log(">>>>>>> userdecoded :  ", userdecoded);
        localStorage.setItem('token', data.token);
        let username= userdecoded.username
        let role = userdecoded.role
        let id  = userdecoded.id
        //console.log(">>>>>>> check data.user:  ", data);
        login({username,role,id})

        if (role!=='admin'){
          setTimeout(() => {
          navigate('/home');
          toast.success("Đăng nhập thành công!");
        }, 100);
        } else {
          navigate('/login');
          toast.success("Đăng nhập thành công!");
        }
        setMessage('');
        

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

    </div>
  )
}

export default Login;