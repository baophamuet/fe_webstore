import React,{useState,useEffect}  from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductDetail.scss";
import { useAuth } from "../routes/AuthContext";
import { FaPen, FaHeart , FaShoppingCart, } from "react-icons/fa";
import { useParams,useNavigate } from 'react-router-dom';
import IconGoBack from "./IconGoBack";
 

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;


export default function ProductDetail() {
    
  const [product, setproduct] = useState(null);
  const { user } = useAuth(); 
  const { ProductId } = useParams();
  const navigate = useNavigate();
  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"
  const settings = {
    dots: true,
    infinite: true, /// case 1 ảnh phải trả thẻ riêng không sẽ bug
    speed: 1000,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: false,
    autoplaySpeed: 5000, 
    adaptiveHeight: false,
  };

      useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi
    
      // Hàm lấy thông tin chi tiết sản phẩm
        const fetchProduct = async (req,res) => {
        if (!ProductId) return; 
        try {
          const response = await fetch(`${server}/products/${ProductId}`, {
            method: "GET", // hoặc không cần ghi vì GET là mặc định
            credentials: 'include', //  cookie đính kèm
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          const data = await response.json(); // Chuyển kết quả thành object
          console.log(">>>>>>>>>> Check data product:    ",data)
          
          setproduct(data.data); // Lưu thông tin sản phẩm vào state

        } catch (error) {
          console.error("Lỗi khi lấy thông tin product:", error);
        }
      };
  
      // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
      fetchProduct();
    }, []);

  return (
    <div className="product-detail">
  {product ? (
    <>
      {/* Slider ảnh sản phẩm */}
      <div className="product-image">
        {user?.role === "admin" && <FaPen className="edit-icon" />}
        
        {(() => {
 
  let images = [];

  if (typeof product?.images === "string") {
    try {
      images = product.images.trim() !== "" ? JSON.parse(product.images) : [defaultImage];
      if (!Array.isArray(images)) images = [defaultImage];
    } catch {
      images = [defaultImage];
    }
  } else if (Array.isArray(product?.images)) {
    images = product.images.length ? product.images : [defaultImage];
  } else {
    images = [defaultImage];
  }

  if (images.length > 1) {
    return (
      <Slider {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="image-slide">
            <img src={img} alt={`${product.name}-${idx}`} loading="lazy" />
          </div>
        ))}
      </Slider>
    );
  } else {
    return (
      <div className="image-slide">
        <img src={images[0]} alt={`${product.name}-0`} loading="lazy" />
      </div>
    );
  }
})()}

      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-stock">Còn lại: {product.stock} sản phẩm</p>
      </div>
    </>
  ) : (
    <div className="loading">Loading...</div>
  )}

  <IconGoBack />
</div>


  );
}
