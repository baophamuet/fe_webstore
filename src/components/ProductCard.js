import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductCard.scss";
import { useAuth } from "../routes/AuthContext";
import { FaPen,   } from "react-icons/fa";

export default function ProductCard({ images, name, price, description, stock,user }) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: false,
    adaptiveHeight: true,
  };

  return (
    <div className="product-card">
      {/* Slider ảnh sản phẩm */}
      <div className="product-image">
        {user?.role ==="admin" ? <FaPen className="edit-icon"/> : null}
        <Slider {...settings}>
          {(images ?? []).map((img, idx) => (
            <div key={idx} className="image-slide">
              <img src={img} alt={`${name}-${idx}`} loading="lazy" />
            </div>
          ))}
        </Slider>
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
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string,
  stock: PropTypes.number,
};

ProductCard.defaultProps = {
  description: "Không có mô tả",
  stock: 0,
};
