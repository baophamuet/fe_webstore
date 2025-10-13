import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  // s có thể là boolean, 0/1, "true"/"false", "0"/"1"
  const isPaid = s === true || s === 1 || s === "1" || s === "true";
  return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
}
const STATUS_FLOW = ["pending", "processing", "shipped", "delivered"];

function firstImage(images, fallback) {
  try {
    if (Array.isArray(images)) return images[0] || fallback;
    if (typeof images === "string") {
      const arr = JSON.parse(images);
      return Array.isArray(arr) ? arr[0] || fallback : fallback;
    }
  } catch (_) {}
  return fallback;
}

export default function OrderDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); // object order
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const defaultImage =
    "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452";

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi
    const fetchOrder = async () => {
      try {
        if (!user?.id || !id) return;
        setLoading(true);
        setErr(null);

        const url = `${server}/users/${user.id}/orders/${id}`;
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        // Có thể BE trả {status:true,data:order} hoặc trả thẳng order
        const json = await res.json();
        const orderObj = json?.data ?? json?.status?.data ?? json;

        if (!res.ok) throw new Error(orderObj?.message || `HTTP ${res.status}`);
        if (!orderObj || typeof orderObj !== "object")
          throw new Error("Không tìm thấy dữ liệu đơn hàng");

        setOrder(orderObj);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user?.id, id]);

  const items = Array.isArray(order?.items) ? order.items : [];
  const orderId = order?.id ?? id;
  const createdAt = order?.created_at ?? order?.createdAt ?? null;
  const currentStatus = order?.status ?? "pending";
  const isCancelled = currentStatus === "cancelled";

  // Nếu BE chưa có struct shipping, tạm dùng phone/address ngay trên order
  const shipping = order?.shipping ?? {
    name: order?.receiver_name || user?.fullname || user?.username || "",
    phone: order?.phone || "",
    addressLine: order?.address || "",
    ward: order?.ward || "",
    district: order?.district || "",
    province: order?.province || "",
    notes: order?.notes || "",
  };

  const totals = useMemo(() => {
    const totalQty = items.reduce((s, it) => s + Number(it?.quantity || 0), 0);
    const totalPrice = items.reduce(
      (s, it) => s + Number(it?.quantity || 0) * Number(it?.price || 0),
      0
    );
    return { totalQty, totalPrice };
  }, [items]);

  const handleContact = () => {
    window.open(
      "https://www.facebook.com/Ladilazy",
      "_blank",
      "noopener,noreferrer"
    );
  };
  const handleProductDetail = (product_id) => {
    if (!product_id) return;
    navigate(`/products/${product_id}`);
  };

  // ====== STATES ======
  if (user === null) return <h1>Vui lòng đăng nhập để xem!</h1>;
  if (loading)
    return <div className="orderdetail px-8 py-6">Đang tải đơn hàng...</div>;
  if (err) return <div className="orderdetail px-8 py-6">Lỗi: {err}</div>;
  if (!order)
    return (
      <div className="orderdetail px-8 py-6">Không tìm thấy đơn hàng.</div>
    );
  const onSubmitPayment = async (e) => {
  const payload = {        
      total_price: totals.totalPrice,
    };
    console.log("Payload being sent to createQR:", payload);
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
}
  // ====== RENDER ======
  return (
    <div className="px-8 py-6 orderdetail">
      <div className="orderdetail__head">
        <div>
          <h1>Thông tin đơn hàng #{orderId}</h1>

          <div className="orderdetail__meta">
            <span>Ngày tạo: {toDate(createdAt)}</span>
            <span
              className={`badge ${
                paymentLabel(order?.payment) === "Đã thanh toán"
                  ? "badge--paid"
                  : "badge--unpaid"
              }`}
            >
              {paymentLabel(order?.payment)}
            </span>
            <span className="badge badge--outline">
              {statusLabel(currentStatus)}
            </span>
          </div>
        </div>
        {paymentLabel(order?.payment) === "Chưa thanh toán"? <button
          type="button"
       
          className="btn btn--ghost"
          onClick={onSubmitPayment}
        >
          Thanh toán ngay
        </button> : null}
        <IconGoBack />
        
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className="shipping-card">
        <div className="shipping-card__title">Địa chỉ nhận hàng</div>
        {shipping?.name || shipping?.phone || shipping?.addressLine ? (
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
                {[
                  shipping?.addressLine,
                  shipping?.ward,
                  shipping?.district,
                  shipping?.province,
                ]
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
              const currentIndex = Math.max(
                0,
                STATUS_FLOW.indexOf(currentStatus)
              );
              const isDone = currentIndex > idx;
              const isActive = currentIndex === idx;
              return (
                <li
                  key={step}
                  className={[
                    "tracker-step",
                    isDone ? "done" : "",
                    isActive ? "active" : "",
                  ]
                    .join(" ")
                    .trim()}
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
        {items.length === 0 ? (
          <div className="order-products__empty">
            Đơn hàng chưa có sản phẩm.
          </div>
        ) : (
          items.map((it, idx) => {
            const img = firstImage(it?.product?.images, defaultImage);
            const line = Number(it?.quantity || 0) * Number(it?.price || 0);
            return (
              <div
                className="order-product"
                key={it?.id ?? `${it?.product?.id || "x"}-${idx}`}
                onClick={() => handleProductDetail(it?.product?.id)}
              >
                <div className="order-product__thumb">
                  <img src={img} alt={it?.product?.name || "Sản phẩm"} />
                </div>
                <div className="order-product__main">
                  <div className="order-product__name">
                    {it?.product?.name || "Sản phẩm"}
                  </div>
                  <div className="order-product__meta">
                    <span>Số lượng: {it?.quantity}</span>
                    <span>Đơn giá: {toCurrency(it?.price)}</span>
                  </div>
                </div>
                <div className="order-product__total">{toCurrency(line)}</div>
              </div>
            );
          })
        )}
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
        <button className="btn btn--ghost" onClick={handleContact}>
          Liên hệ hỗ trợ
        </button>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
