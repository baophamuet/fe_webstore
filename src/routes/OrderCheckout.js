// pages/OrderCheckout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/OrderCheckout.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;

const STORAGE_KEY_ITEMS = "checkout_items";

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

/** Hàm fetch tạo đơn có timeout + gửi cookie */
async function createOrder(payload, userId, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(`${server}/users/${userId}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // gửi cookie JWT, v.v.
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });

    // HTTP lỗi
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.log(`Lỗi : `);
      // throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    const data = await res.json();
    console.log(`check data sau khi tạo đơn`, data);

    if (data?.status) {
      return data.data;
    }

    // throw new Error(`Phản hồi tạo đơn không hợp lệ. \n data.messagez: ${data.message} `);
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
  const items =
    Array.isArray(stateItems) && stateItems.length
      ? stateItems
      : loadCheckoutItems();

  useEffect(() => {
    // Không có dữ liệu => quay về giỏ
  }, [items, navigate]);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    paymentmethod: "COD",
  });

  const total = useMemo(
    () =>
      items.reduce(
        (s, it) =>
          s +
          Number(it._priceNumber ?? it.price) *
            Number(it._qty ?? it.quantity ?? 1),
        0
      ),
    [items]
  );

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting order with data:", form);
    if (!form.phone.trim() || !form.address.trim()) return;

    const payload = {
      // lấy từ useParams()/session
      phone: form.phone.trim(),
      address: form.address.trim(),
      paymentmethod: form.paymentmethod,
      items: items,
      total_price: items.reduce(
        (s, it) =>
          s +
          Number(it._priceNumber ?? it.price) *
            Number(it._qty ?? it.quantity ?? 1),
        0
      ),
    };
    console.log("Payload being sent to createOrder:", payload);

    try {
      setSubmitting(true); // nếu bạn có state loading
      const order = await createOrder(payload, user.id); // { id, ... }
      // dọn storage nếu dùng sessionStorage
      sessionStorage.removeItem("checkout_items");

      toast.success(`Tạo đơn mã #${order.id} thành công!`);
      // điều hướng sang trang chi tiết đơn
      navigate(`/users/orders/${order.id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Tạo đơn thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitPayment = async (e) => {
    e.preventDefault();
    console.log("Submitting order with data:", form);
    if (!form.phone.trim() || !form.address.trim()) return;

    const payload = {
      // lấy từ useParams()/session
      
      phone: form.phone.trim(),
      address: form.address.trim(),
      paymentmethod: form.paymentmethod,
      items: items,
      total_price: items.reduce(
        (s, it) =>
          s +
          Number(it._priceNumber ?? it.price) *
            Number(it._qty ?? it.quantity ?? 1),
        0
      ),
    };
    console.log("Payload being sent to createQR:", payload);

    try {
      setSubmitting(true); // nếu bạn có state loading
      const order = await createOrder(payload, user.id); // { id, ... }
      // dọn storage nếu dùng sessionStorage
      sessionStorage.removeItem("checkout_items");

      toast.success(`Tạo đơn mã #${order.id} thành công!`);
   
      try {
        const payment = await fetch(`${server}/create-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // gửi cookie JWT, v.v.
          body: JSON.stringify({
            ...payload,
            order_id: order.id, // ID của đơn hàng sau khi tạo bước trước
          }),
        });
        // HTTP lỗi
    if (!payment.ok) {
      const text = await payment.text().catch(() => "");
      console.log(`Lỗi : `);
      // throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    console.log(`check payment`, payment);
    const linkpayment = await payment.json();
    console.log(`Link tạo thanh toán thành công linkpayment`, linkpayment);
    // tạo cửa số thanh toán cho đơn hàng
    if (linkpayment?.url) {
      window.open(linkpayment.url, "_blank", "width=1000,height=800,scrollbars=yes");
      } else if (typeof linkpayment === "string") {
      window.open(linkpayment, "_blank", "width=1000,height=800,scrollbars=yes");
      } else {
      console.error("Không tìm thấy link thanh toán hợp lệ:", linkpayment);
    }
      }catch(err){
        console.error(err);
        alert(err.message || "Tạo thanh toán thất bại. Vui lòng thử lại.");
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Tạo đơn thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleContact = () => {
    window.open(
      "https://www.facebook.com/Ladilazy",
      "_blank",
      "noopener,noreferrer"
    );
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
        {/* ✅ Phương thức thanh toán */}
        <div className="form-row payment-method">
          <label>Phương thức thanh toán</label>
          <div className="options">
            <label>
              <input
                type="radio"
                name="paymentmethod"
                value="COD"
                checked={form.paymentmethod === "COD"}
                onChange={onChange}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input
                type="radio"
                name="paymentmethod"
                value="ONLINE"
                checked={form.paymentmethod === "ONLINE"}
                onChange={onChange}
              />
              Thanh toán Online QRCode (ATM, Momo, ZaloPay...)/thẻ visa nội địa/quốc tế
            </label>
          </div>

          {/* Nếu chọn COD => hiện hướng dẫn  */}
          {form.paymentmethod === "COD" && (
            <div className="ONLINE-info">
              <p>Free ship cho đơn hàng > 500.000đ</p>
              <p>Kiểm hàng thoải mái trước khi thanh toán</p>
              <p>Hỗ trợ đổi hàng trong vòng 30 ngày</p>
              <p>
                Chúng tôi sẽ <label>XÁC NHẬN</label> đơn hàng bằng TIN NHẮN SMS
                hoặc GỌI ĐIỆN.{" "}
              </p>
              <p>
                {" "}
                Bạn vui lòng kiểm tra TIN NHẮN hoặc NGHE MÁY ngay khi đặt hàng
                thành công và CHỜ NHẬN HÀNG
              </p>
            </div>
          )}

          {/* Nếu chọn ONLINE => hiện hướng dẫn + ảnh QR */}
          {form.paymentmethod === "ONLINE" && (
            <div className="ONLINE-info">
              {/*<img
                src="/images/qr-ONLINE.png"
                alt="QR chuyển khoản"
                className="qr-img"
              />
              <p>
                Vui lòng quét mã QR để chuyển khoản. Nội dung:{" "}
                <b>DON HANG CUA {user?.username}</b>
              </p>
              <p>
                Chủ tài khoản: <b>NGUYEN VAN A</b> <br />
                Số tài khoản: <b>123456789</b> - VietcomONLINE
              </p>*/
                <p>
                Quý khách có thể thanh toán ngay hoặc vui lòng tạo đơn hàng trước khi thanh toán!                
              </p>
              }
            </div>
          )}
        </div>
      </form>

      <div className="checkout-items">
        {items.map((it, idx) => {
          const img =
            it._imgUrl ||
            (Array.isArray(it._imagesArr) ? it._imagesArr[0] : "") ||
            (typeof it.images === "string"
              ? JSON.parse(it.images || "[]")[0]
              : "");
          const name = it?.name || it?.product?.name || `Sản phẩm #${idx + 1}`;
          const qty = it._qty ?? it.quantity ?? 1;
          const price = Number(it._priceNumber ?? it.price);

          return (
            <div key={it.id || idx} className="checkout-item-card">
              <div className="thumb">
                {img ? (
                  <img src={img} alt={name} />
                ) : (
                  <div className="no-img" />
                )}
              </div>
              <div className="content">
                <div className="name">{name}</div>
                <div className="meta">
                  <span>Số lượng: {qty}</span>
                  <span>Đơn giá: {price.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
              <div className="price">
                {(price * qty).toLocaleString("vi-VN")} ₫
              </div>
            </div>
          );
        })}

        <div className="checkout-summary">
          <div className="row">
            <strong>
              Tổng số lượng:{" "}
              {items.reduce((s, it) => s + (it._qty ?? it.quantity ?? 1), 0)}{" "}
            </strong>
          </div>
          <div className="row">
            <strong>
              Tổng tiền hàng:{" "}
              {items
                .reduce(
                  (s, it) =>
                    s +
                    Number(it._priceNumber ?? it.price) *
                      Number(it._qty ?? it.quantity ?? 1),
                  0
                )
                .toLocaleString("vi-VN")}{" "}
              ₫
            </strong>
          </div>
        </div>

        {/* ✅ Nút xác nhận đặt ngay trên khu actions */}
        <button
          type="submit"
          form="order-form"
          className="btn-confirm"
          onSubmit={onSubmit}
        >
          Xác nhận tạo đơn
        </button>
        {form.paymentmethod === "ONLINE" && (<button
          type="button"
       
          className="btn-confirm"
          onClick={onSubmitPayment}
        >
          Thanh toán ngay
        </button>)}
        <div className="checkout-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleContact}
          >
            Liên hệ hỗ trợ
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}
