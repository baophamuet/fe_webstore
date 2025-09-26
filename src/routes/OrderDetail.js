import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import IconGoBack from "../components/IconGoBack";
import "../styles/OrderDetail.scss";

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
  // s có thể là boolean hoặc "true"/"false"
  const isPaid = (s === true) || (s === "true") || (s === 1) || (s === "1");
  return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
}
const STATUS_FLOW = ["pending", "processing", "shipped", "delivered"];

function firstImage(images, fallback) {
  try {
    if (Array.isArray(images)) return images[0] || fallback;
    if (typeof images === "string") {
      const arr = JSON.parse(images);
      return Array.isArray(arr) ? (arr[0] || fallback) : fallback;
    }
  } catch (_) {}
  return fallback;
}

export default function OrderDetail() {
  const [products, setProducts] = useState([]);     // mảng items: [{order_id, quantity, price, product:{id,name,images}}]
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderNew, setOrderNew] = useState(false); // meta đơn hàng: { id?, status?, payment?, created_at?, shipping? }

  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        if (!user?.id || !id) return;
        console.log("URL đang gọi:", `${server}/users/${user.id}/orders/${id}`);

        const response = await fetch(`${server}/users/${user.id}/orders/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        console.log("HTTP Status:", response.status);
        const data = await response.json();
        console.log(">>>>>>>>>> Check data:    ", data);

        // Giữ nguyên cách bạn set (API của bạn đã chuẩn)
        setProducts(data?.status?.data || []);
        setOrderNew(data?.status?.data || false);
        console.log(">>>>>>>>>> Check orderNew:    ", data?.status?.data || false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [user?.id, id, server]);

  const handleContact = () => {
    window.open("https://www.facebook.com/Ladilazy", "_blank", "noopener,noreferrer");
  };
  const handleProductDetail = (product_id) => {
    if (!product_id) return;
    navigate(`/products/${product_id}`);
  };

  // ====== Derive meta & totals ======
  const orderId = orderNew?.id || products?.[0]?.order_id || id;
  const createdAt = orderNew?.created_at || null;
  const currentStatus = orderNew?.status || "pending";
  const isCancelled = currentStatus === "cancelled";
  const shipping = orderNew?.shipping || null; // nếu BE trả về, dùng luôn; nếu chưa có thì để null

  const totals = useMemo(() => {
    const totalQty = products.reduce((s, it) => s + Number(it?.quantity || 0), 0);
    const totalPrice = products.reduce(
      (s, it) => s + Number(it?.quantity || 0) * Number(it?.price || 0),
      0
    );
    return { totalQty, totalPrice };
  }, [products]);

  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem!</h1>;
  }
  if (!orderNew) {
    return (
          <div className="px-8 py-6 orderdetail">
      <div className="orderdetail__head">
        <div>
          <h1>Thông tin đơn hàng #{orderId}</h1>
          <div className="orderdetail__meta">
            <span>Ngày tạo: {orderNew?.createdAt}</span>
            <span className={`badge ${paymentLabel(orderNew?.payment) === "Đã thanh toán" ? "badge--paid" : "badge--unpaid"}`}>
              {paymentLabel(orderNew?.payment)}
            </span>
            <span className="badge badge--outline">{statusLabel(currentStatus)}</span>
          </div>
        </div>
        <IconGoBack />
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className="shipping-card">
        <div className="shipping-card__title">Địa chỉ nhận hàng</div>
        {shipping ? (
          <div className="shipping-card__content">
            <div className="shipping-row">
              <span>Người nhận:</span>
              <strong>{shipping?.name || "-"}</strong>
            </div>
            <div className="shipping-row">
              <span>Điện thoại:</span>
              <strong>{shipping?.phone || "-"}</strong>
            </div>
            <div className="shipping-row">
              <span>Địa chỉ:</span>
              <strong>
                {[shipping?.addressLine, shipping?.ward, shipping?.district, shipping?.province]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </strong>
            </div>
            {shipping?.notes ? (
              <div className="shipping-row">
                <span>Ghi chú:</span>
                <em>{shipping?.notes}</em>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="shipping-card__content shipping-card__content--empty">
            Chưa có địa chỉ nhận hàng
          </div>
        )}
      </div>

      {/* Tracker trạng thái */}
      <div className="order-tracker">
        {isCancelled ? (
          <div className="order-tracker__cancelled">
            <span className="dot dot--cancelled" />
            <span>Đơn hàng đã hủy</span>
          </div>
        ) : (
          <ul className="tracker-steps">
            {STATUS_FLOW.map((step, idx) => {
              const currentIndex = STATUS_FLOW.indexOf(currentStatus);
              const isDone = currentIndex > idx;
              const isActive = currentIndex === idx;
              return (
                <li
                  key={step}
                  className={[
                    "tracker-step",
                    isDone ? "done" : "",
                    isActive ? "active" : "",
                  ].join(" ").trim()}
                >
                  <div className="tracker-step__dot" />
                  <div className="tracker-step__label">{statusLabel(step)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-products">
        {products.map((it, idx) => {
          const img = firstImage(it?.product?.images, defaultImage);
          const line = Number(it?.quantity || 0) * Number(it?.price || 0);
          return (
            <div
              className="order-product"
              key={`${it?.product?.id || idx}-${idx}`}
              onClick={() => handleProductDetail(it?.product?.id)}
            >
              <div className="order-product__thumb">
                <img src={img} alt={it?.product?.name || "Sản phẩm"} />
              </div>
              <div className="order-product__main">
                <div className="order-product__name">{it?.product?.name || "Sản phẩm"}</div>
                <div className="order-product__meta">
                  <span>Số lượng: {it?.quantity}</span>
                  <span>Đơn giá: {toCurrency(it?.price)}</span>
                </div>
              </div>
              <div className="order-product__total">{toCurrency(line)}</div>
            </div>
          );
        })}
      </div>

      {/* Tổng kết */}
      <div className="order-summary">
        <div className="order-summary__row">
          <span>Tổng số lượng</span>
          <strong>{totals.totalQty}</strong>
        </div>
        <div className="order-summary__row">
          <span>Tổng tiền hàng</span>
          <strong>{toCurrency(totals.totalPrice)}</strong>
        </div>
      </div>

      <div className="order-actions">
        <button className="btn btn--ghost" onClick={handleContact}>Liên hệ hỗ trợ</button>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
      </div>
    </div>
    );
  }

  return (
    <div className="px-8 py-6 orderdetail">
      <div className="orderdetail__head">
        <div>
          <h1>Thông tin đơn hàng #{orderId}</h1>
          <div className="orderdetail__meta">
            <span>Ngày tạo: {orderNew?.createdAt}</span>
            <span className={`badge ${paymentLabel(orderNew?.payment) === "Đã thanh toán" ? "badge--paid" : "badge--unpaid"}`}>
              {paymentLabel(orderNew?.payment)}
            </span>
            <span className="badge badge--outline">{statusLabel(currentStatus)}</span>
          </div>
        </div>
        <IconGoBack />
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className="shipping-card">
        <div className="shipping-card__title">Địa chỉ nhận hàng</div>
        {shipping ? (
          <div className="shipping-card__content">
            <div className="shipping-row">
              <span>Người nhận:</span>
              <strong>{shipping?.name || "-"}</strong>
            </div>
            <div className="shipping-row">
              <span>Điện thoại:</span>
              <strong>{shipping?.phone || "-"}</strong>
            </div>
            <div className="shipping-row">
              <span>Địa chỉ:</span>
              <strong>
                {[shipping?.addressLine, shipping?.ward, shipping?.district, shipping?.province]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </strong>
            </div>
            {shipping?.notes ? (
              <div className="shipping-row">
                <span>Ghi chú:</span>
                <em>{shipping?.notes}</em>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="shipping-card__content shipping-card__content--empty">
            Chưa có địa chỉ nhận hàng
          </div>
        )}
      </div>

      {/* Tracker trạng thái */}
      <div className="order-tracker">
        {isCancelled ? (
          <div className="order-tracker__cancelled">
            <span className="dot dot--cancelled" />
            <span>Đơn hàng đã hủy</span>
          </div>
        ) : (
          <ul className="tracker-steps">
            {STATUS_FLOW.map((step, idx) => {
              const currentIndex = STATUS_FLOW.indexOf(currentStatus);
              const isDone = currentIndex > idx;
              const isActive = currentIndex === idx;
              return (
                <li
                  key={step}
                  className={[
                    "tracker-step",
                    isDone ? "done" : "",
                    isActive ? "active" : "",
                  ].join(" ").trim()}
                >
                  <div className="tracker-step__dot" />
                  <div className="tracker-step__label">{statusLabel(step)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-products">
        {products.map((it, idx) => {
          const img = firstImage(it?.product?.images, defaultImage);
          const line = Number(it?.quantity || 0) * Number(it?.price || 0);
          return (
            <div
              className="order-product"
              key={`${it?.product?.id || idx}-${idx}`}
              onClick={() => handleProductDetail(it?.product?.id)}
            >
              <div className="order-product__thumb">
                <img src={img} alt={it?.product?.name || "Sản phẩm"} />
              </div>
              <div className="order-product__main">
                <div className="order-product__name">{it?.product?.name || "Sản phẩm"}</div>
                <div className="order-product__meta">
                  <span>Số lượng: {it?.quantity}</span>
                  <span>Đơn giá: {toCurrency(it?.price)}</span>
                </div>
              </div>
              <div className="order-product__total">{toCurrency(line)}</div>
            </div>
          );
        })}
      </div>

      {/* Tổng kết */}
      <div className="order-summary">
        <div className="order-summary__row">
          <span>Tổng số lượng</span>
          <strong>{totals.totalQty}</strong>
        </div>
        <div className="order-summary__row">
          <span>Tổng tiền hàng</span>
          <strong>{toCurrency(totals.totalPrice)}</strong>
        </div>
      </div>

      <div className="order-actions">
        <button className="btn btn--ghost" onClick={handleContact}>Liên hệ hỗ trợ</button>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
      </div>
    </div>
  );
}
