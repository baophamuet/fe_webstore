import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import IconGoBack from "../components/IconGoBack";
import "../styles/Orders.scss";

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;

function toCurrency(v) {
  const n = Number(v);
  return isNaN(n) ? v : n.toLocaleString("vi-VN") + " ₫";
}
function toDate(iso) {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso ?? "-";
  }
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

// chống stringify 2 lần
function normalizeImages(images) {
  try {
    if (Array.isArray(images)) return images;
    if (typeof images === "string" && images.trim() !== "") {
      let parsed = JSON.parse(images);
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {}
      }
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultImage =
    "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452";

  useEffect(() => {
    if (!user) return;
    window.scrollTo(0, 0);

    const fetchOrders = async () => {
      try {
        const url = `${server}/users/${user.id}/orders`;
        console.log("URL đang gọi:", url);
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(">>> Check data:", data);
        // đảm bảo có mảng orders
        setOrders(data?.status?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleContact = () => {
    window.open("https://www.facebook.com/Ladilazy", "noopener,noreferrer");
  };

  const handleProductDetail = (product_id) => {
    if (!product_id) return;
    navigate(`/products/${product_id}`);
  };

  const handleOrderDetail = (order_id) => {
    if (!order_id) return;
    navigate(`/users/orders/${order_id}`);
  };

  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem!</h1>;
  }

  return (
    <div className="px-8 py-6">
      <h1>Lịch sử đơn hàng</h1>

      <div className="orderssl">
        {orders.map((o) => {
          const total = Number(o.total_price ?? 0);

          return (
            <article key={o.id} className="orderssl-card">
              <header className="orderssl-header">
                <div className="orderssl-shop">
                  <span className="orderssl-shop-name">Đơn #{o.id}</span>
                  <span className="orderssl-sep">•</span>
                  <span className="orderssl-date">{toDate(o.created_at)}</span>
                </div>
                <div className={`orderssl-status orderssl-status--${o.status}`}>
                  {statusLabel(o.status)}
                </div>
                <div
                  className={`orderssl-status ${
                    o.payment ? "orderssl-status--delivered" : "orderssl-status--processing"
                  }`}
                >
                  {paymentLabel(o.payment)}
                </div>
              </header>

              <div className="orderssl-items">
                {(o.items || []).map((it, idx) => {
                  const name = it?.product?.name ?? "-";
                  const qty = Number(it?.quantity ?? 0);
                  const price = Number(it?.price ?? 0);
                  const product_id = it?.product?.id;
                  const lineTotal = qty * price;

                  // fix parse images
                  const imgs = normalizeImages(it?.product?.images);
                  const imgUrl = imgs.length ? imgs[0] : defaultImage;

                  return (
                    <div
                      key={idx}
                      className="orderssl-item"
                      onClick={() => handleProductDetail(product_id)}
                    >
                      <div className="orderssl-item__left">
                        <img src={imgUrl} alt={name} className="orderssl-thumb" />
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
                <button type="button" className="btn btn-outline" onClick={handleContact}>
                  Liên hệ Shop
                </button>
                <div className="orderssl-actions__right">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleOrderDetail(o.id)}
                  >
                    Xem chi tiết
                  </button>
                  <button type="button" className="btn btn-outline">
                    Mua lại
                  </button>
                  <button type="button" className="btn btn-primary">
                    Đánh giá
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <IconGoBack />
    </div>
  );
}
