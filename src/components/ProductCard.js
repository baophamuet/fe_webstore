import React from "react";
import PropTypes from "prop-types";
import "../styles/ProductCard.scss";

export default function ProductCard({ image, name, price, description, stock }) {
  return (
    <div className="product-card">
      {/* Ảnh sản phẩm */}
      <div className="product-image">
        <img src={image} alt={name} loading="lazy" />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
        <p className="product-description">{description}</p>
        <p className="product-stock">Còn lại: {stock} sản phẩm</p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string,
  stock: PropTypes.number
};

ProductCard.defaultProps = {
  description: "Không có mô tả",
  stock: 0
};
