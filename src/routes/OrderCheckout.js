// pages/OrderCheckout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/OrderCheckout.scss";


//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;

const STORAGE_KEY_ITEMS = "checkout_items";
const STORAGE_KEY_TEMPID = "checkout_temp_id";

function loadCheckoutItems() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function loadTempId() {
  try {
    return sessionStorage.getItem(STORAGE_KEY_TEMPID) || "";
  } catch {
    return "";
  }
}

/** Hàm fetch tạo đơn có timeout + gửi cookie */
async function createOrder(payload,userId, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(`${server}/users/${userId}/orders/${payload.temp_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // gửi cookie JWT, v.v.
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });

    // HTTP lỗi
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    const data = await res.json().catch(() => ({}));

    // Phổ biến BE của bạn: {status: true, data: {id: ...}}
    if (data?.status) {
        return data.status;
    }
    // Hoặc trả thẳng order: {id: ...}
    if (data?.id) return data;

    throw new Error("Phản hồi tạo đơn không hợp lệ.");
  } finally {
    clearTimeout(t);
  }
}

export default function OrderCheckout() {
  const { id: routeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  // Ưu tiên state nếu có, nhưng fallback sang sessionStorage
  const stateItems = location.state?.items;
  const items = Array.isArray(stateItems) && stateItems.length
    ? stateItems
    : loadCheckoutItems();

  // Kiểm tra id tạm cho “nhất quán” URL vs storage (không bắt buộc)
  const tempId = routeId || loadTempId();

  useEffect(() => {
    // Không có dữ liệu => quay về giỏ
    if (!items.length) {
      navigate("/cart", { replace: true });
    }
  }, [items, navigate]);

  const [form, setForm] = useState({ phone: "", address: "" });

  const total = useMemo(
    () =>
      items.reduce(
        (s, it) =>
          s +
          Number(it._priceNumber ?? it.price) * Number(it._qty ?? it.quantity ?? 1),
        0
      ),
    [items]
  );

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting order with data:", form,);
  if (!form.phone.trim() || !form.address.trim()) return;

  const payload = {
    temp_id: tempId,             // lấy từ useParams()/session
    phone: form.phone.trim(),
    address: form.address.trim(),
    items: items,
    total_price: items.reduce((s, it) =>
          s + Number(it._priceNumber ?? it.price) * Number(it._qty ?? it.quantity ?? 1), 0)
  };
  console.log("Payload being sent to createOrder:", payload);

  try {
    setSubmitting(true); // nếu bạn có state loading
    const order = await createOrder(payload,user.id); // { id, ... }
    // dọn storage nếu dùng sessionStorage
    sessionStorage.removeItem("checkout_items");
    sessionStorage.removeItem("checkout_temp_id");

    // điều hướng sang trang chi tiết đơn
    navigate(`/users/orders/${order.id}`);
  } catch (err) {
    console.error(err);
    alert(err.message || "Tạo đơn thất bại. Vui lòng thử lại.");
  } finally {
    setSubmitting(false);
  }
};

  const handleContact = () => {
    window.open("https://www.facebook.com/Ladilazy", "_blank", "noopener,noreferrer");
  };
  return (
    <div className="order-checkout">
      <h2>Thông tin nhận hàng</h2>

      <form id="order-form" className="order-form" onSubmit={onSubmit}>
        <div className="form-row">
          <label>Số điện thoại</label>
          <input
            name="phone"
            placeholder="09xxxxxxxx"
            value={form.phone}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Địa chỉ</label>
          <textarea
            name="address"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            value={form.address}
            onChange={onChange}
            rows={3}
          />
        </div>

      </form>

    <div className="checkout-items">
  {items.map((it, idx) => {
    const img =
      it._imgUrl ||
      (Array.isArray(it._imagesArr) ? it._imagesArr[0] : "") ||
      (typeof it.images === "string" ? JSON.parse(it.images || "[]")[0] : "");
    const name = it?.name || it?.product?.name || `Sản phẩm #${idx + 1}`;
    const qty = it._qty ?? it.quantity ?? 1;
    const price = Number(it._priceNumber ?? it.price);

    return (
      <div key={it.id || idx} className="checkout-item-card">
        <div className="thumb">
          {img ? <img src={img} alt={name} /> : <div className="no-img" />}
        </div>
        <div className="content">
          <div className="name">{name}</div>
          <div className="meta">
            <span>Số lượng: {qty}</span>
            <span>Đơn giá: {price.toLocaleString("vi-VN")} ₫</span>
          </div>
        </div>
        <div className="price">{(price * qty).toLocaleString("vi-VN")} ₫</div>
      </div>
    );
  })}

  <div className="checkout-summary">
    <div className="row">
      <strong>Tổng số lượng:  {items.reduce((s, it) => s + (it._qty ?? it.quantity ?? 1), 0)} </strong>
    </div>
    <div className="row">
      <strong>Tổng tiền hàng:   {items.reduce((s, it) =>
          s + Number(it._priceNumber ?? it.price) * Number(it._qty ?? it.quantity ?? 1), 0
        ).toLocaleString("vi-VN")} ₫
      </strong>
    </div>
  </div>

  {/* ✅ Nút xác nhận đặt ngay trên khu actions */}
  <button type="submit" form="order-form" className="btn-confirm" onSubmit={onSubmit} >
    Xác nhận tạo đơn
  </button>

  <div className="checkout-actions">
    <button type="button" className="btn-secondary" onClick={handleContact}>Liên hệ hỗ trợ</button>
    <button type="button" className="btn-secondary" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
  </div>
</div>


    </div>
  );
}
