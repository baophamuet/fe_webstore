import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import IconGoBack from '../components/IconGoBack';
import '../styles/Cart.scss';

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;
export default function Cart() {
  const [productsCart, setProductsCart] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fulluser, setfulluser] = useState(null); 

  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi

    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
            console.log("URL đang gọi:", `${server}/users/${user.id}/cart`); // Kiểm tra URL

        const response = await fetch(`${server}/users/${user.id}/cart`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
           credentials: 'include', // Quan trọng
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("HTTP Status:", response.status); 
        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ",data)
        setProductsCart(data.data); // Lưu danh sách sản phẩm vào state
        setfulluser(data.user); // Lưu full thông tin người dùng vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, [user]);
  
  const handleClinkViewOrders = () => {
    navigate(`/users/${user.id}/orders`);
  } 
  
  //===========================

   // Chuẩn hóa price về number
  const products = useMemo(
    () => (productsCart || []).map((p) => ({ ...p, _priceNumber: Number(p.price) || 0 })),
    [productsCart]
  );

  const [qtyMap, setQtyMap] = useState(() =>
    Object.fromEntries(products.map((p) => [p.id, 1]))
  );
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const allSelected = products.length > 0 && selectedIds.size === products.length;

  const toggleOne = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelectedIds((prev) =>
      prev.size === products.length ? new Set() : new Set(products.map((p) => p.id))
    );

  const incQty = (id, stock) =>
    setQtyMap((prev) => {
      const cur = prev[id] || 1;
      return { ...prev, [id]: Math.min(cur + 1, stock ?? Number.MAX_SAFE_INTEGER) };
    });

  const decQty = (id) =>
    setQtyMap((prev) => {
      const cur = prev[id] || 1;
      return { ...prev, [id]: Math.max(cur - 1, 1) };
    });

  const setQty = (id, val, stock) => {
    const n = Math.max(1, Math.min(Number(val) || 1, stock ?? Number.MAX_SAFE_INTEGER));
    setQtyMap((prev) => ({ ...prev, [id]: n }));
  };

  const selectedItems = useMemo(
    () =>
      products
        .filter((p) => selectedIds.has(p.id))
        .map((p) => ({
          ...p,
          _qty: qtyMap[p.id] || 1,
          _lineTotal: (qtyMap[p.id] || 1) * p._priceNumber,
        })),
    [products, selectedIds, qtyMap]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((s, it) => s + it._lineTotal, 0),
    [selectedItems]
  );

  const fmtPrice = (n) => `${(n || 0).toLocaleString("vi-VN")} đ`;

  const handleCreateOrder = () => {
    if (!selectedItems.length) return;
    // Điều hướng sang trang tạo đơn như bạn yêu cầu
    let id = Date.now();
    navigate(`/users/orders/${id}`);
  };

  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem giỏ hàng</h1>;
  } 
  else 
  return (
    <div className="px-8 py-6">
    <h1>Giỏ hàng</h1>
    
    <div className="order-cart">
      <div className="order-cart__head">
        <label className="check-all">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          <span >Chọn tất cả</span>
        </label>
      </div>

      <div className="order-cart__list">
        {products.map((p) => {
          const isChecked = selectedIds.has(p.id);
          const qty = qtyMap[p.id] || 1;

          // parse images ngay lúc render (style bạn yêu cầu)
          let imgUrl = null;
          try {
            const arr = JSON.parse(p?.images || "[]");
            imgUrl = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
          } catch {
            imgUrl = null;
          }

          return (
            <div className={`order-row ${isChecked ? "is-checked" : ""}`} key={p.id}>
              <div className="order-row__left">
                <div className="order-row__check">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOne(p.id)}
                    aria-label={`Chọn ${p.name}`}
                  />
                </div>

                <div className="order-row__thumb">
                  {imgUrl ? (
                    <img src={imgUrl} alt={p.name} loading="lazy" />
                  ) : (
                    <div className="thumb--placeholder">No Image</div>
                  )}
                </div>

                <div className="order-row__info">
                  <div className="order-row__name">{p.name}</div>
                  <div className="order-row__variant">Phân loại: —</div>

                  {/* Stepper số lượng, giữ tính năng nhưng làm gọn */}
                  <div className="qty">
                    <button className="qty__btn" onClick={() => decQty(p.id)} aria-label="Giảm">
                      −
                    </button>
                    
                    <input
                      className="qty__input"
                      type="number"
                      min={0}
                      max={p.stock ?? undefined}
                      value={qty}
                      onChange={(e) => setQty(p.id, e.target.value, p.stock)}
                    />
                    <button
                      className="qty__btn"
                      onClick={() => incQty(p.id, p.stock)}
                      aria-label="Tăng"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-row__right">
                <div className="unit-x-qty">
                  {fmtPrice(p._priceNumber)} <span className="mul">×</span> {qty}
                </div>
                <div className="line-total">{fmtPrice(qty * p._priceNumber)}</div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && <div className="empty">Giỏ hàng trống.</div>}
      </div>

      <div className="order-cart__footer">
        <div className="pay-summary">
          <span>Thành tiền:</span>
          <strong className="pay-total">{fmtPrice(totalPrice)}</strong>
        </div>
        <button
          className="btn-create"
          disabled={selectedItems.length === 0}
          onClick={handleCreateOrder}
        >
          Chuyển tạo đơn hàng
        </button>
      </div>
    </div>
    
    <h1 onClick={handleClinkViewOrders} >Lịch sử order</h1>
    <IconGoBack/>
    </div>
  );
}