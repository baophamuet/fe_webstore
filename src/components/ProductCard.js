import React,{useState}  from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductCard.scss";
import { useAuth } from "../routes/AuthContext";
import { FaPen, FaHeart , FaShoppingCart, } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ productId,images, name, price, description, stock,user }) {
  const [IconHeart, setIconHeart] = useState(false);
  const [IconShoppingCart, setIconShoppingCart] = useState(false);
      const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true, /// case 1 ảnh phải trả thẻ riêng không sẽ bug
    speed: 1000,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 5000, 
    adaptiveHeight: false,
  };
  const handleCickIconHeart = () => {
    setIconHeart(!IconHeart);
  }
  const handleCickIconShoppingCart = () => {
    setIconShoppingCart(!IconShoppingCart);
  }
  const handleClickViewDetail = () => {
  try {
    navigate(`/products/${productId}`); // chuyển sang trang login
    
    }catch(e) {
      console.error('Login error:', e);
    }
  }
  return (
    <div className="product-card">
      {/* Slider ảnh sản phẩm */}
      <div className="product-image">
        {user?.role ==="admin" ? <FaPen className="edit-icon"/> : null}
        {images?.length > 1 
        ?(
          <Slider {...settings}>
            {images.map((img, idx) => (
            <div key={idx} className="image-slide">
              <img src={img} alt={`${name}-${idx}`} loading="lazy" />
            </div>))
            }
          </Slider>) 
         : (
          <div className="image-slide">
            <img src={images[0]} alt={`${name}-0`} loading="lazy" />
          </div>
          )}
      </div>

      {/* Thẻ giữa slider và thông tin sản phẩm */}
      <div className="product-actions">
        <div className="left">
          {IconHeart 
            ?<FaHeart className="heart-icon-like" onClick={handleCickIconHeart}/>    
            :<FaHeart className="heart-icon-non" onClick={handleCickIconHeart} />
        }
          
            <span>Yêu thích</span>    
        </div>
        <button className="view-details-button" onClick={handleClickViewDetail}>Xem chi tiết</button>
        </div>
      {/* Thẻ giữa mua ngay hoặc thêm vào giỏ hàng */}
      <div className="product-actions-FaShoppingCart">
        {IconShoppingCart
         ?<div className="left">
          <FaShoppingCart className="ShoppingCart-added" onClick={handleCickIconShoppingCart} />
            <span>Đã thêm vào giỏ hàng</span>    
        </div>        
         :<div className="left">
          <FaShoppingCart className="ShoppingCart-non-added" onClick={handleCickIconShoppingCart} />
            <span>Thêm vào giỏ hàng</span>    
        </div>
        }

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
