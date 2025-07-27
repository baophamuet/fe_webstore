import React, { useEffect, useState } from 'react';
import '../../styles/ListUsers.scss';
import { useAuth } from '../../routes/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const ListUsers = () => {
    const { user,logout } = useAuth(); // Lấy user từ AuthContext
    const [ Users, setUsers] = useState(null);
    const avatar= "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/489297728_8974365879331129_951253005109429353_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gJp7cAySx8oQ7kNvwFfHOpo&_nc_oc=AdnV0Q13_PScZPz_PKssDtEcmhUyUnCPkKoQPMkGzcA0Q_rk1nl1JwU5YtAQ5xScN5sHHSAcnxGrsvRuGzL65P3Y&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=ZovJhmmlyIn-K-0-ffkNQA&oh=00_AfQ-ZJrR0Wlq0kMEHNUlH8IqAR-Z0kwVIC3oMNwduiYFiA&oe=688A53F1"

    useEffect(() => {
      // Hàm lấy danh sách sản phẩm
      const fetchProfile = async () => {
        if (!user) return; 
        try {
          const response = await fetch(`http://baophamuet.site:8080/users/`, {
            method: "GET", // hoặc không cần ghi vì GET là mặc định
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          const data = await response.json(); // Chuyển kết quả thành object
          console.log(">>>>>>>>>> Check data:    ",data)
          setUsers(data.data.Users); // Lưu thông tin user vào state
          console.log(">>>>>>>>>> Check userData:    ",Users)
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      };
  
      // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
      fetchProfile();
    }, [user]);

   return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {Users && Users.length > 0 ? (
            Users.map((userview) => (
              <tr key={userview.id}>
                <td>
                  <div className="avatar-section">
                    <img
                      src={userview.avatar || avatar}
                      alt="Avatar"
                      className="avatar"
                    />
                  </div>
                </td>
                <td>{userview.full_name}</td>
                <td className=''>{userview.username}</td>
                <td>{userview.email}</td>
                <td>{userview.gender}</td>
                <td>{userview.role}</td>
                <td>{new Date(userview.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty-msg">Đang tải thông tin danh sách người dùng...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default ListUsers;
