import { useState } from "react";
import {useNavigate} from "react-router-dom"
import "../styles/RegisterForm.scss";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    gender: { value: "male", label: "Nam" },
    role: "user", // mặc định
  });

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (e) => {
    const selected = genderOptions.find(g => g.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      gender: selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Gửi API tại đây
   try {
      const response = await fetch('http://baophamuet.site:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          full_name: formData.full_name,
          gender: formData.gender.value, // Lấy giá trị từ object
          role: formData.role || "user",
          created_at: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (response.ok) {
        
        console.log("Kết quả:", result);
        if (response.body.status) {
        // Reset form
        setFormData({
          username: "",
          password: "",
          email: "",
          full_name: "",
          gender: { value: "male", label: "Nam" },
          role: "user",
        });
        navigate('/login')
        }
        else {
          alert("❌ Đăng ký thất bại: Đã tồn tại username");
        }
      } else {
        alert("❌ Đăng ký thất bại: " + (result.message || "Lỗi không xác định."));
      }
    } catch (error) {
      console.error("Lỗi mạng hoặc máy chủ:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Đăng ký tài khoản</h2>
      <label>Username</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} required />

      <label>Password</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Họ và tên</label>
      <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />

      <label>Giới tính</label>
      <select name="gender" value={formData.gender.value} onChange={handleGenderChange}>
        {genderOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default RegisterForm;
