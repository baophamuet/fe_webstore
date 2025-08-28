import React from "react";
import "../styles/Loading.scss"; // file css riêng

export default function Loading({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="overlay">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}
