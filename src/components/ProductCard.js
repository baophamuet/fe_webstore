import React,{useState,useRef }  from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductCard.scss";
import { useAuth } from "../routes/AuthContext";
import { FaPen, FaHeart , FaShoppingCart,FaTshirt,FaTrash, FaTrashAlt, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import PortalModal from "./PortalModal"; // ✅ dùng PortalModal
import EditProductModal from "../components/EditProductModal";
import { TRUE } from "sass";

const server = process.env.REACT_APP_API_URL;
export default function ProductCard({ productId,images, name, price, description, stock,user, IconHeart,IconCart  }) {
  //const [IconHeart, setIconHeart] = useState(IconHeartView);
  const { logout, updateFavorites,updateCart } = useAuth();

  //const [IconShoppingCart, setIconShoppingCart] = useState(false);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [editProduct,setEditProduct]=  useState(false);
  const [removeProduct,setRemoveProduct]=  useState(false);
  const [authenticator,setAuthenticator]=  useState(false);
  const [showConfirm,setshowConfirm]=  useState(false);


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

  const handleCickIconFaPen = () =>{
    setEditProduct(!editProduct)
  }
  const handleCickIconFaTrash=()=>{
    setRemoveProduct(!removeProduct)
  }
  let handleCickConfirmRemoveProduct = async ()=>{
    if (removeProduct) {
      console.log("Check đang hiện cửa sổ confirm: ", removeProduct);
      try {
        const response = await fetch(`${server}/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to remove Product');
        const data = await response.json();
        console.log("Check server sau khi thực hiện :", data);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  }
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

  // Mở popup hướng dẫn
  const handleCickIconVituralOutfit = async (e) => {
    if (loading)  return;
    e.preventDefault();
    
        try {
          const response = await fetch(`${server}/checkauthenticator`, {
            method: 'GET',
            credentials: 'include', //  cookie đính kèm
            headers: {
              'Content-Type': 'application/json'
            },

          });
              
          const data = await response.json();
          console.log(">>>>>>> check authenticator:  ", data);
    
          if (response.ok && (data.status)) {
            setAuthenticator(true)
            setshowConfirm(false)
          } else {
            setAuthenticator(false)         
            setshowConfirm(true)
          }
        } catch (error) {
          console.error('authenticator error:', error);
        }
    if (!images || images.length < 1) {
      console.error("Không có ảnh trang phục để thử đồ online");
      return;
    }
    console.log("MỞ MODAL HƯỚNG DẪN");
    setShowGuide(true);
  };

  // Người dùng đồng ý -> mở hộp chọn ảnh
  const handleContinueFromGuide = () => {
    console.log("ĐÓNG MODAL & MỞ FILE PICKER");
    setShowGuide(false);
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  const handleFileChosen = (e) => {
    const modelFile = e.target.files?.[0];
    e.target.value = ""; // reset để chọn lại cùng file vẫn trigger
    if (!modelFile) {
      console.error("Chưa chọn ảnh người mẫu");
      return;
    }
    if (!images || images.length < 1) {
      console.error("Không có ảnh trang phục để thử đồ online");
      return;
    }

    const outfitUrl = images[0];
    const prompt =
      "Hãy kết hợp người mẫu từ ảnh khách hàng và trang phục từ ảnh 2, tạo ảnh người mẫu mặc trang phục tự nhiên và chân thực.";

    const formData = new FormData();
    formData.append("modelFile", modelFile);
    formData.append("outfitUrl", outfitUrl);
    formData.append("prompt", prompt);

    setLoading(true);
    fetch(`${server}/combine-image`, { method: "POST", body: formData })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) {
          setResultUrl(data.resultUrl);
          setShowResult(true); 
           console.log("check URL ảnh được lưu:  ", data.resultUrl)
          //window.open(server+data.resultUrl, "_blank");
        } else {
          console.error("Lỗi khi kết hợp ảnh:", data?.error);
        }
      })
      .catch((err) => console.error("Lỗi kết nối:", err))
      .finally(() => setLoading(false));
  };

  const handleCickConfirmAuthenticator = () =>{
      logout() // gọi hàm xử lý logout, ví dụ xóa token
      setAuthenticator(false)
      setshowConfirm(false)
      navigate('/login'); // chuyển sang trang login 
      
  }
  return (
    <div className="product-card">
      {/* Thẻ ẩn chọn ảnh  */}
      <input
  id="tryonFile"
  ref={fileInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={handleFileChosen}
/>

      {/* Slider ảnh sản phẩm */}
      <div className="product-image">
        {user?.role ==="admin" 
        ?
        <div className="edit-actions">
          <FaPen className="edit-icon" onClick={handleCickIconFaPen} />
          <FaRegTrashAlt className="edit-icon" onClick={handleCickIconFaTrash} />
        </div>

        : null}
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

        {/* Thẻ HOT thử trang phục online */}
      <div className="product-actions-FaTshirt">
        {images?.length > 0 && images[0] ? (
          <div className="left">
            <FaTshirt
              className={`FaTshirt-added ${loading ? "disabled" : ""}`}
              onClick={handleCickIconVituralOutfit}
              title={loading ? "Đang xử lý..." : "Thử đồ online nào!"}
              style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            />
            <span>{loading ? "Đang kết hợp ảnh..." : "Thử đồ online nào!!!"}</span>
          </div>
        ) : (
          <div className="left"></div>
        )}
      </div>

      {/* Thông tin sản phẩm ... */}

      {/* Modal hướng dẫn qua PortalModal */}
      {
      authenticator
      ? <PortalModal open={showGuide} onClose={() => setShowGuide(false)}>

        <div>
        <h4>Hướng dẫn trước khi thử đồ</h4>
        <ul>
          <li>Ảnh rõ nét, nên chỉ 1 người; nhìn thẳng, toàn thân càng tốt.</li>
          <li>Nền gọn gàng; tránh che mặt, đội nón, kính râm.</li>
          <li>Tệp JPG/PNG/WEBP và &lt; 10MB.</li>
          <li>
            Chúng tôi chỉ dùng ảnh để tạo thử đồ theo{" "}
            <a href="/privacy" target="_blank" rel="noreferrer">chính sách quyền riêng tư</a>.
          </li>
          <li className="ai-note">Ảnh được tạo bởi AI, kết quả có thể không hoàn hảo và chính xác như mong muốn!</li>
        </ul>
        <div className="tryon-guide-actions">
          <button className="btn-secondary" onClick={() => setShowGuide(false)}>Hủy</button>
          <button className="btn-primary" onClick={handleContinueFromGuide}>Tiếp tục chọn ảnh</button>
        </div>
        </div>
      </PortalModal>
      :  <PortalModal open={showConfirm} onClick={() => setshowConfirm(false)}>
      <div className="confirm-box">
  <p>Hãy đăng nhập tài khoảng để thử tính năng nhé!</p>
  <div className="actions">
    <button className="btn-confirm" onClick={handleCickConfirmAuthenticator}>
      Có
    </button>
    <button className="btn-cancel" onClick={() => setshowConfirm(false)}>
      Không
    </button>
  </div>
</div>

  </PortalModal>
}
      {/* Modal KẾT QUẢ sau khi xử lý */}
<PortalModal open={showResult} onClose={() => setShowResult(false)}>
  <div className="tryon-result-modal">
    <h4>Kết quả thử đồ</h4>
    {resultUrl ? (
      <img
        src={server+resultUrl}
        alt="Kết quả thử đồ"
        className="tryon-result-image"
      />
    ) : (
      <p>Không tìm thấy ảnh kết quả.</p>
    )}
    <line className="ai-note">Ảnh được tạo bởi AI, kết quả có thể không hoàn hảo và chính xác như mong muốn!</line>
    <div className="tryon-guide-actions">
      <button className="btn-secondary" onClick={() => setShowResult(false)}>Đóng</button>
      {resultUrl && (
        <>
          <a className="btn-primary" href={resultUrl} download>Tải xuống</a>
          <button
            className="btn-primary"
            onClick={() => {
              setShowResult(false);
              fileInputRef.current?.click(); // thử lại ảnh khác
            }}
          >
            Thử ảnh khác
          </button>
        </>
      )}
    </div>
  </div>
</PortalModal>
<PortalModal open={editProduct} onClose={() => setEditProduct(false)}>
      <EditProductModal  productId={productId} open={editProduct} onClose={() => setEditProduct(false)} />
</PortalModal>
<PortalModal open={removeProduct} onClose={() => setRemoveProduct(false)}>
      <div className="confirm-box">
  <p>Bạn có chắc chắn xóa sản phẩm không!</p>
  <div className="actions">
    <button className="btn-confirm" onClick={handleCickConfirmRemoveProduct}>
      Có
    </button>
    <button className="btn-cancel" onClick={() => setRemoveProduct(false)}>
      Không
    </button>
  </div>
</div>

  </PortalModal>
  


      
      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
        {stock>1 
        ? <p className="product-stock">Còn sản phẩm</p>
        : <p className="product-stock">Liên hệ CSKH</p>
      }
        
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
