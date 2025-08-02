import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.scss';
import { useAuth } from '../routes/AuthContext';
import { FaSignOutAlt,FaUserEdit,FaKey,FaCamera } from 'react-icons/fa';
import IconGoBack from './IconGoBack';
import { toast } from "react-toastify";

const UserProfile = () => {
    const { user,logout, } = useAuth(); // Lấy user từ AuthContext
    const [userData, setUserData] = useState(null);
    const [avatar, setavatar] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [changePassword, setchangePassword] = useState(false);
    const [formData, setFormData] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    avatar: null,
    pathAvatar: '',
  });
    const server= `http://localhost:8080`
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
     const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" }
  ];
    //const avatar= "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/489297728_8974365879331129_951253005109429353_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gJp7cAySx8oQ7kNvwFfHOpo&_nc_oc=AdnV0Q13_PScZPz_PKssDtEcmhUyUnCPkKoQPMkGzcA0Q_rk1nl1JwU5YtAQ5xScN5sHHSAcnxGrsvRuGzL65P3Y&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=ZovJhmmlyIn-K-0-ffkNQA&oh=00_AfQ-ZJrR0Wlq0kMEHNUlH8IqAR-Z0kwVIC3oMNwduiYFiA&oe=688A53F1"

    const handleEditProfile = ()=>{
    console.log("check editProfile:   ",editProfile)
     setFormData({
        full_name: userData.full_name,
        email: userData.email,
        oldPassword: '',
        newPassword: '',
        gender: userData.gender,
        role: userData.role,
        pathAvatar: userData.pathAvatar
      });
    if(!editProfile) setEditProfile(!editProfile)
    
    }
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
          const response = await fetch(`${server}/users/${user.id}`, {
            method: "GET", // hoặc không cần ghi vì GET là mặc định
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          const data = await response.json(); // Chuyển kết quả thành object
          console.log(">>>>>>>>>> Check data:    ",data)
          setUserData(data.data); // Lưu thông tin user vào state
          setavatar(data.data.pathAvatar)
          console.log(">>>>>>>>>> Check userData:    ",userData)
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      };
  
      // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
      fetchProfile();
    }, [user]);

  // nút show đổi mật khẩu
  const handleChangePassword= () =>{
    setchangePassword(!changePassword)

  }

  //nút save profile mới sau thay đổi 
  const handleClickSaveProfile = async () => {
  if (!userData) {
    toast.error("Thông tin người dùng chưa sẵn sàng.");
    return;
  }
  const formDataToSend = new FormData();
  formDataToSend.append("username", userData.username);
  formDataToSend.append("email", formData.email);
  if(changePassword) {
    formDataToSend.append("oldPassword", formData.oldPassword);
  formDataToSend.append("newPassword", formData.newPassword);
  } else {
        formDataToSend.append("oldPassword", null);
  formDataToSend.append("newPassword", null);
  }
  
  formDataToSend.append("full_name", formData.full_name);
  formDataToSend.append("gender", formData.gender);

  if (formData.avatar) {
    formDataToSend.append("profile_avt", formData.avatar); // tên này phải trùng multer
  }else formDataToSend.append("profile_avt", null); // tên này phải trùng multer
  try {
    const response = await fetch(`${server}/user`, {
      method: 'PUT', // hoặc 'POST' nếu backend bạn yêu cầu POST
      body: formDataToSend
    });

    const data = await response.json();
   // console.log("Checkk req.body >>> :    ",formData)
    console.log("Checkk response >>> :    ",data)
    if ((response.ok)&&(data.status)) {
      toast.success("Đã lưu thông tin!");
      setUserData(prev => ({
        ...prev,
        ...formData,
        avatar: data.status.data.pathAvatar || null
      }));
      setEditProfile(false);
      setavatar(data.status.data.pathAvatar)
      // Reload trang login
      window.location.reload();
    } else {
      toast.error("Nhập sai mật khẩu hiện tại");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API lưu thông tin:", error);
    toast.error("Lỗi khi kết nối đến máy chủ.");
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
    const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange  = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      avatar: file,
      pathAvatar: URL.createObjectURL(file),
    }));
  };
  return (
    <div className="user-profile">
        {!userData ? (
      <>
      <p>Đang tải thông tin người dùng...</p>
       <p className="logout" onClick={handleChangeLogout}><FaSignOutAlt /> Đăng xuất</p>
      </>
    ) : (
      <>
            <div className="avatar-section">
        <div>
          {editProfile
          ? <>
            <div className="edit-profile"> 
            <FaUserEdit className="edit-profile" style={{ marginRight: '6px' }} />
          <label>Chỉnh sửa hồ sơ</label>
          <label className="save-button" onClick={handleClickSaveProfile} >Lưu</label>
            </div>
            
          <div className="avatar-container"  onClick={handleAvatarClick}      >
  <img src={`${server}${avatar}?t=${new Date().getTime()}`} alt="Avatar" className="avatar" />
  <FaCamera className="camera-icon"/>
   <input
            type="file"
            name="profile_avt"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
</div>
          </>
          
          :
          <>
          <div className="edit-profile" onClick={handleEditProfile}>
            <FaUserEdit style={{ marginRight: '6px' }} />
            Chỉnh sửa hồ sơ 
          </div>
          <div className="avatar-container">
  <img src={`${server}${avatar}?t=${new Date().getTime()}`} alt="Avatar" className="avatar" />
</div>
          </>
          }                    
          </div>
        
        
         {editProfile ?
         (<h2> <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  /> </h2>)
         :(<h2>{userData.full_name}</h2>)}
        <p className='username' >@{userData.username}</p>
      </div>
      <div className="info-section">
        {editProfile ? (
              <>
                <p><strong>Email:</strong>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </p>
                {changePassword ? (
                  <>
                  <p className="edit-profile" onClick={handleChangePassword}>
              
            <FaKey  style={{ marginRight: '6px' }} />
            Đổi mật khẩu - Bỏ qua
          </p>
                  <p><strong>Old Password:</strong>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                  />
                </p>
                <p><strong>New Password:</strong>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </p> 
                  </>
                ) : (
                  <p className="edit-profile" onClick={handleChangePassword}>
            <FaKey  style={{ marginRight: '6px' }} />
            Đổi mật khẩu
          </p>
                )
              }
                         
                <p>
                  <strong>Giới tính:</strong>
                  <select
                      name="gender"
                      value={formData.gender|| 'male'}
                      onChange={handleInputChange}
                      >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                      {option.label}
                      </option>
                    ))}
                  </select>
                  </p>     
                <p><strong>Role:</strong> {userData.role}</p>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Gender:</strong> {userData.gender}</p>
                <p><strong>Role:</strong> {userData.role}</p>
              </>
            )}      

        <p className="logout" onClick={handleChangeLogout}><FaSignOutAlt /> Đăng xuất</p>
        <IconGoBack/>
      </div>
      </>  
    )}
    </div>
  );
};

export default UserProfile;
