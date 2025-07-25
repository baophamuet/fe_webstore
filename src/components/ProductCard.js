import React from "react";
import "../styles/ProductCard.scss";

export default function ProductCard() {
  return (
    <div className="product-card">
      {/* Ảnh sản phẩm */}
      <div className="product-image">
        <img
          src="https://pos.nvncdn.com/fa2431-2286/ps/20250520_iQZZZQ2ucf.jpeg?v=1747734626"
          alt="Áo Phông Regular Cotton 1400"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <div className="product-colors">
          <span className="color-dot black" />
          <span className="color-dot gray" />
          <span className="color-dot red selected" />
        </div>

        <p className="product-name">Áo Phông Regular Cotton 1400</p>
        <p className="product-price">269,000₫</p>
      </div>

      {/* Nút hành động */}
      <div className="product-buttons">
        <button className="btn buy-now">🛒 Mua nhanh</button>
        <button className="btn view-detail">🔍 Xem chi tiết</button>
      </div>
    </div>
  );
}
