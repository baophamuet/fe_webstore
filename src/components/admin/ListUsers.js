import React, { useEffect, useState } from "react";
import "../../styles/ListUsers.scss";
import { useAuth } from "../../routes/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import IconGoBack from "../IconGoBack";
import avatarDefault from "../../assets/images/gender_other.png";
import PortalModal from "../PortalModal";

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;
const ListUsers = () => {
  const { user, logout } = useAuth(); // Lấy user từ AuthContext
  const [Users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(false);

  useEffect(() => {
    // Hàm lấy danh sách sản phẩm
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${server}/users/`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
          credentials: "include", //  cookie đính kèm
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ", data);
        setUsers(data.data.Users); // Lưu thông tin user vào state
        console.log(">>>>>>>>>> Check userData:    ", data.data.Users);
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
            <th>ID</th>
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
              <tr
                key={userview.id}
                onClick={() => {
                  setSelectedUser(userview);
                  setViewUser(true);
                }}
                className={selectedUser?.id === userview.id ? "selected" : ""}
              >
                <td>
                  <div className="avatar-section">
                    <img
                      src={
                        userview.pathAvatar
                          ? server + userview.pathAvatar
                          : avatarDefault
                      }
                      alt="Avatar"
                      className="avatar"
                    />
                  </div>
                </td>
                <td>{userview.id}</td>
                <td>{userview.full_name}</td>
                <td className="">{userview.username}</td>
                <td>{userview.email}</td>
                <td>{userview.gender}</td>
                <td>{userview.role}</td>
                <td>
                  {new Date(userview.created_at).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty-msg">
                Đang tải thông tin danh sách người dùng...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <IconGoBack />
      {selectedUser && (
        <PortalModal open={viewUser} onClose={() => setViewUser(false)}>
          <div className="user-profile">
            <div className="avatar-section">
              <img
                src={server + selectedUser.pathAvatar}
                alt="Avatar"
                className="avatar"
              />
              <h2>{selectedUser.full_name}</h2>
              <p>@{selectedUser.username}</p>
            </div>
            <div className="info-section">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Gender:</strong> {selectedUser.gender}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </div>
          </div>
        </PortalModal>
      )}
    </div>
  );
};

export default ListUsers;
