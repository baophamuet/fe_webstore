// ProductList.js
import React from "react";
import ProductCard from "./ProductCard"; // Đảm bảo đường dẫn đúng
import "../styles/ProductList.scss";     // CSS dành cho layout

export default function ProductList() {
  // Giả sử có 6 sản phẩm giống nhau
  return (
    <div className="product-list">
      {[...Array(6)].map((_, index) => (
        <ProductCard key={index} />
      ))}
    </div>
  );
}
