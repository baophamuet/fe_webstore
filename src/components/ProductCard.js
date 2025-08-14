import React,{useState}  from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductCard.scss";
import { useAuth } from "../routes/AuthContext";
import { FaPen, FaHeart , FaShoppingCart,FaTshirt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const server = process.env.REACT_APP_API_URL;
export default function ProductCard({ productId,images, name, price, description, stock,user, IconHeart,IconCart  }) {
  //const [IconHeart, setIconHeart] = useState(IconHeartView);
  const { updateFavorites,updateCart } = useAuth();

  //const [IconShoppingCart, setIconShoppingCart] = useState(false);
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
  const handleCickIconHeart =  async() => {
    if (!user?.id) return; // chặn nếu chưa login

    //setIconHeart(!IconHeart);
    
     

    if (!IconHeart) {
      console.log("log check IconHeart khi trước đánh dấu thay đổi: ", IconHeart);
      // Thêm sản phẩm vào yêu thích
      try {
        const response = await fetch(`${server}/users/${user.id}/favorite`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to add to favorites');
        const data = await response.json();
        console.log("Thêm vào yêu thích :", data);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
        updateFavorites(productId, 'add'); // ✅ Cập nhật context

    } else {
      console.log("log check IconHeart khi trước đánh dấu thay đổi: ", IconHeart);
      // Xóa sản phẩm vào yêu thích
      try {
        const response = await fetch(`${server}/users/${user.id}/favorite`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to delete to favorites');
        const data = await response.json();
        console.log("Bảng đã xóa: ", data);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
        updateFavorites(productId, 'remove'); // ✅ Cập nhật context
    }
    
  }
  const handleCickIconShoppingCart = async () => {
    if (!user?.id) return; // chặn nếu chưa login
    //setIconShoppingCart(!IconShoppingCart);
        if (!IconCart) {
      console.log("log check IconCart khi trước đánh dấu thay đổi: ", IconCart);
      // Thêm sản phẩm vào yêu thích
      try {
        const response = await fetch(`${server}/users/${user.id}/cart`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        const data = await response.json();
        console.log("Thêm vào giỏ :", data);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
        updateCart(productId, 'add'); // ✅ Cập nhật context

    } else {
      console.log("log check IconCart khi trước đánh dấu thay đổi: ", IconCart);
      // Xóa sản phẩm vào yêu thích
      try {
        const response = await fetch(`${server}/users/${user.id}/cart`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to delete to cart');
        const data = await response.json();
        console.log("Giỏ sau khi xóa sản phẩm: ", data);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
        updateCart(productId, 'remove'); // ✅ Cập nhật context
    }
  }
  const handleClickViewDetail = () => {
  try {
    navigate(`/products/${productId}`); // chuyển sang xem chi tiết sản phẩm
    
    }catch(e) {
      console.error('Login error:', e);
    }
  }

  const handleCickIconVituralOutfit = () => {
  // Tạo input ẩn
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  // Khi người dùng chọn file
  input.onchange = (e) => {
    const modelFile = e.target.files[0];
    if (!modelFile) {
      console.error("Chưa chọn ảnh người mẫu");
      return;
    }

    if (!images || images.length < 1) {   
      console.error('Không có ảnh trang phục để thử đồ online');
      return;
    }

    const outfitUrl = images[0]; // ảnh outfit có sẵn
    const prompt = "Hãy kết hợp người mẫu từ ảnh khách hàng và trang phục từ ảnh 2, tạo ảnh người mẫu mặc trang phục tự nhiên và chân thực.";

    const formData = new FormData();
    formData.append("modelFile", modelFile); 
    formData.append("outfitUrl", outfitUrl);
    formData.append("prompt", prompt);

    fetch(`${server}/combine-image`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const imageUrl = data.imageUrl; 
          window.open(imageUrl, "_blank");
        } else {
          console.error("Lỗi khi kết hợp ảnh:", data.error);
        }
      })
      .catch((error) => {
        console.error("Lỗi kết nối:", error);
      });
  };

  // Gắn input vào DOM tạm thời và trigger click
  document.body.appendChild(input);
  input.click();

  // Xoá đi sau khi dùng xong
  input.remove();
};


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
        {IconCart
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


      {/* Thẻ HOT thử trang phụ online */}
      <div className="product-actions-FaShoppingCart">
        {images?.length > 0 && images[0] && images[1] 

         ?<div className="left">
            <FaTshirt className="ShoppingCart-added" onClick={handleCickIconVituralOutfit} />
            <span>Thử đồ online nào!!!</span>    
        </div>        
         :<div className="left">

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
