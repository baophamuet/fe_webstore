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
    avatar: null 
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      avatar: file
    }));
  };

  const formDataToSend = new FormData();
  formDataToSend.append("username", formData.username);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("full_name", formData.full_name);
  formDataToSend.append("gender", formData.gender.value);
  formDataToSend.append("role", formData.role);
  formDataToSend.append("created_at", new Date().toISOString());

  // ✅ Gửi file đúng cách:
  if (formData.avatar) {
    formDataToSend.append("profile_avt", formData.avatar); // tên này phải trùng multer
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Gửi API tại đây
   try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'POST',
        body: formDataToSend
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
      <label>Chọn ảnh Avatar</label>
      <input
        type="file"
        name="profile_avt"
        onChange={handleFileChange}
      />
      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default RegisterForm;
