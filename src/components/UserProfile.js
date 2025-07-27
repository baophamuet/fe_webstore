import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.scss';
import { useAuth } from '../routes/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import IconGoBack from './IconGoBack';

const UserProfile = () => {
    const { user,logout } = useAuth(); // Lấy user từ AuthContext
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const avatar= "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/489297728_8974365879331129_951253005109429353_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gJp7cAySx8oQ7kNvwFfHOpo&_nc_oc=AdnV0Q13_PScZPz_PKssDtEcmhUyUnCPkKoQPMkGzcA0Q_rk1nl1JwU5YtAQ5xScN5sHHSAcnxGrsvRuGzL65P3Y&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=ZovJhmmlyIn-K-0-ffkNQA&oh=00_AfQ-ZJrR0Wlq0kMEHNUlH8IqAR-Z0kwVIC3oMNwduiYFiA&oe=688A53F1"
//    const user = {
//     username: "nanatran",
//     email: "nanatran@gmail.com",
//     full_name: "Na Na",
//     gender: "female",
//     role: "user",
//     avatar: "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/489297728_8974365879331129_951253005109429353_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gJp7cAySx8oQ7kNvwFfHOpo&_nc_oc=AdnV0Q13_PScZPz_PKssDtEcmhUyUnCPkKoQPMkGzcA0Q_rk1nl1JwU5YtAQ5xScN5sHHSAcnxGrsvRuGzL65P3Y&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=ZovJhmmlyIn-K-0-ffkNQA&oh=00_AfQ-ZJrR0Wlq0kMEHNUlH8IqAR-Z0kwVIC3oMNwduiYFiA&oe=688A53F1"
//   };
     const handleChangeLogout = (e) =>{
    try {
      logout() // gọi hàm xử lý logout, ví dụ xóa token
      navigate('/login'); // chuyển sang trang login
    }catch(e) {
      console.error('Login error:', e);
    }
  }
    useEffect(() => {
      // Hàm lấy danh sách sản phẩm
      const fetchProfile = async () => {
        if (!user) return; 
        try {
          const response = await fetch(`http://baophamuet.site:8080/users/${user.id}`, {
            method: "GET", // hoặc không cần ghi vì GET là mặc định
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          const data = await response.json(); // Chuyển kết quả thành object
          console.log(">>>>>>>>>> Check data:    ",data)
          setUserData(data.data); // Lưu thông tin user vào state
          console.log(">>>>>>>>>> Check userData:    ",userData)
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      };
  
      // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
      fetchProfile();
    }, [user]);

  return (
    <div className="user-profile">
        {!userData ? (
      <p>Đang tải thông tin người dùng...</p>
    ) : (
      <>
            <div className="avatar-section">
        <img src={avatar} alt="Avatar" className="avatar" />
        <h2>{userData.full_name}</h2>
        <p>@{userData.username}</p>
      </div>
      <div className="info-section">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p className="logout" onClick={handleChangeLogout}><FaSignOutAlt /> Đăng xuất</p>
        <IconGoBack/>
      </div>
      </>  
    )}
    </div>
  );
};

export default UserProfile;
