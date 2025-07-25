import React, { Component } from 'react';
import '../../styles/Login.scss';
import { toast,ToastContainer } from 'react-toastify';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  handleChangeLogin = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmitLogin = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log(">>>>>>> check data:  ",data)
      if (data.status) {
        this.setState({ message: '✅ Đăng nhập thành công!' });
        toast.success("Đăng nhập thành công!")
        // Gợi ý: Lưu token để sử dụng sau
        localStorage.setItem('token', data.token);
      } else {
        this.setState({ message:  data.message });
        toast.error("Sai tài khoản/mật khẩu!")
      }
    } catch (error) {
      this.setState({ message: 'Lỗi kết nối đến server!' });
      console.error('Login error:', error);
      toast.error("Không thể đăng nhập!")
    }
  }

  render() {
    const { username, password, message } = this.state;

    return (
      <div className="login-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={this.handleSubmitLogin}>
          <input
            type="text"
            name="username"
            placeholder="Tài khoản"
            value={username}
            onChange={this.handleChangeLogin}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={this.handleChangeLogin}
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
  }
}

export default Login
