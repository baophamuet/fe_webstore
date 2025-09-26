import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import IconGoBack from '../components/IconGoBack';
import '../styles/Orders.scss';

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;
function toCurrency(v) {
  const n = Number(v);
  return isNaN(n) ? v : n.toLocaleString("vi-VN") + " ₫";
}
function toDate(iso) {
  try { return new Date(iso).toLocaleString("vi-VN"); } catch { return iso ?? "-"; }
}

function statusLabel(s) {
  const map = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  return map[s] || s;
}
function paymentLabel(s) {
  const map = {
    false: "Chưa thanh toán",
    true: "Đã thanh toán",
  };
  return map[s] || s;
}

export default function Orders() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fulluser, setfulluser] = useState(null); 

  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi

    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
            console.log("URL đang gọi:", `${server}/users/${user.id}/orders`); // Kiểm tra URL

        const response = await fetch(`${server}/users/${user.id}/orders`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
           credentials: 'include', // Quan trọng
          headers: {
            "Content-Type": "application/json"
          },
        });
        console.log("HTTP Status:", response.status); 
        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ",data)
        setProducts(data.status.data); // Lưu danh sách sản phẩm vào state
        setfulluser(data.user); // Lưu full thông tin người dùng vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, [user]);
  
  
  const handleContact = () => {
     window.open("https://www.facebook.com/Ladilazy","noopener,noreferrer");
  }
    const handleProductDetail = (product_id) => {
    console.log(">>> Check id sp: ", product_id);
    if(!product_id) return;
    navigate(`/products/${product_id}`);
  
  } 
  
  const handleOrderDetail = (order_id) => {
    console.log(">>> Check id sp: ", order_id);
    if(!order_id) return;
    navigate(`/users/orders/${order_id}`);
  
  }
  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem!</h1>;
  } 
  else 
  return (
    <div className="px-8 py-6">
    <h1>Lịch sử đơn hàng</h1>
    
     <div className="orderssl">
      {products.map((o) => {
        const total = Number(o.total_price ?? 0);

        return (
          <article key={o.id} className="orderssl-card">
            <header className="orderssl-header">
              <div className="orderssl-shop">
                <span className="orderssl-shop-name">Đơn #{o.id}</span>
                <span className="orderssl-sep">•</span>
                <span className="orderssl-date">{toDate(o.created_at)}</span>
              </div>
              {
                (o.status === 'delivered')
                ? (
                  <div className="orderssl-status orderssl-status--delivered">{statusLabel(o.status)}</div>
                )
                : (o.status === 'cancelled')
                ? (
                  <div className="orderssl-status orderssl-status--cancelled">{statusLabel(o.status)}</div>
                )
                : (o.status === 'shipped')
                ?(
                  <div className="orderssl-status orderssl-status--shipped">{statusLabel(o.status)}</div>
                ):(
                  <div className="orderssl-status orderssl-status--processing">{statusLabel(o.status)}</div>  
                )
              }
              {
                (o.payment === true)
                ?(
                  <div className="orderssl-status orderssl-status--delivered">{paymentLabel(o.payment)}</div>
                ):(
                  <div className="orderssl-status orderssl-status--processing">{statusLabel(o.status)}</div>  
                )
              }
              
            </header>

            <div className="orderssl-items" >
              {(o.items || []).map((it, idx) => {
                const name = it?.product?.name ?? "-";
                const qty = Number(it?.quantity ?? 0);
                const price = Number(it?.price ?? 0);
                const product_id = it?.product?.id;
                const lineTotal = qty * price;

                // parse images
                let imgUrl = null;
                try {
                  const arr = JSON.parse(it?.product?.images || "[]");
                  imgUrl = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
                } catch {
                  imgUrl = null;
                }

                return (
                  <div key={idx} className="orderssl-item" onClick={()=>handleProductDetail(product_id)}>
                    <div className="orderssl-item__left">
                      {imgUrl && (
                        <img src={imgUrl} alt={name} className="orderssl-thumb" />
                      )}
                      <div className="orderssl-info">
                        <div className="orderssl-title">{name}</div>
                        <div className="orderssl-opts">Phân loại: —</div>
                      </div>
                    </div>
                    <div className="orderssl-item__right">
                      <div className="orderssl-price">
                        <span className="orderssl-price__unit">{toCurrency(price)}</span>
                        <span className="orderssl-mult">x{qty}</span>
                      </div>
                      <div className="orderssl-line-total">{toCurrency(lineTotal)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="orderssl-summary">
              <span className="orderssl-summary__label">Thành tiền:</span>
              <span className="orderssl-summary__value">{toCurrency(total)}</span>
            </div>

            <div className="orderssl-actions">
              <button type="button" className="btn btn-outline" onClick={handleContact}>Liên hệ Shop
              </button>
              <div className="orderssl-actions__right">
                <button type="button" className="btn btn-ghost" onClick={()=>handleOrderDetail(o.id)} >Xem chi tiết</button>
                <button type="button" className="btn btn-outline">Mua lại</button>
                <button type="button" className="btn btn-primary">Đánh giá</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>

    
    <IconGoBack/>
    </div>
  );
}