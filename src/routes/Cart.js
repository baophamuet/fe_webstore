import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import IconGoBack from '../components/IconGoBack';
import '../styles/Cart.scss';

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;
const STORAGE_KEY_ITEMS = "checkout_items";


function toNumberAny(v) {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  // bỏ mọi ký tự không phải số, dấu .,- (đề phòng "1.299 đ", "300đ", "1,299.00")
  const s = String(v).replace(/[^\d.-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function normalizeImages(images) {
  try {
    if (Array.isArray(images)) return images;
    if (typeof images === "string" && images.trim() !== "") {
      let parsed = JSON.parse(images);
      // trường hợp stringify 2 lần
      if (typeof parsed === "string") {
        try { parsed = JSON.parse(parsed); } catch {}
      }
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

export default function Cart() {
  const [productsCart, setProductsCart] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fulluser, setfulluser] = useState(null);
  const { updateCart } = useAuth();

  useEffect(() => {
    if (!user) return;
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const url = `${server}/users/${user.id}/cart`;
        console.log("URL đang gọi:", url);
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setProductsCart(data?.data || []);
        setfulluser(data?.user || null);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, [user]);

  const handleClinkViewOrders = () => {
    navigate(`/users/${user.id}/orders`);
  };

  // Chuẩn hoá product: ép price -> number, ép images -> arr, tính sẵn imgUrl
  const products = useMemo(() => {
    return (productsCart || []).map((p) => {
      const imgs = normalizeImages(p?.images);
      return {
        ...p,
        _priceNumber: toNumberAny(p?.price),
        _imagesArr: imgs,
        _imgUrl: imgs.length ? imgs[0] : null,
      };
    });
  }, [productsCart]);

  // qtyMap luôn sync với danh sách sản phẩm (thêm item mới sẽ có qty=1)
  const [qtyMap, setQtyMap] = useState({});
  useEffect(() => {
    setQtyMap((prev) => {
      const next = { ...prev };
      for (const p of products) {
        if (next[p.id] == null) next[p.id] = 1;
      }
      // xoá qty của item đã không còn trong list
      const ids = new Set(products.map((p) => p.id));
      for (const k of Object.keys(next)) {
        if (!ids.has(Number(k))) delete next[k];
      }
      return next;
    });
  }, [products]);

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  // bỏ chọn những id không còn tồn tại khi list đổi
  useEffect(() => {
    setSelectedIds((prev) => {
      const ids = new Set(products.map((p) => p.id));
      const next = new Set();
      prev.forEach((id) => { if (ids.has(id)) next.add(id); });
      return next;
    });
  }, [products]);

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
        .map((p) => {
          const _qty = qtyMap[p.id] || 1;
          return { ...p, _qty, _lineTotal: _qty * p._priceNumber };
        }),
    [products, selectedIds, qtyMap]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((s, it) => s + it._lineTotal, 0),
    [selectedItems]
  );

  const fmtPrice = (n) => `${(n || 0).toLocaleString("vi-VN")} đ`;

  const handleCreateOrder = () => {

    try {
      sessionStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(selectedItems));

    } catch (e) {
      console.error("Không lưu được vào Storage:", e);
      return;
    }
    if (!selectedItems.length) return;
    navigate(`/ordercheckout/`);
  };
  const handleCickIconShoppingCart = async (productId) => {
    
    if (!user?.id) return; // chặn nếu chưa login
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

  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem giỏ hàng</h1>;
  }

  return (
    <div className="px-8 py-6">
      <h1>Giỏ hàng</h1>

      <div className="order-cart">
        <div className="order-cart__head">
          <label className="check-all">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            <span>Chọn tất cả</span>
          </label>
        </div>

        <div className="order-cart__list">
          {products.map((p) => {
            const isChecked = selectedIds.has(p.id);
            const qty = qtyMap[p.id] || 1;

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
                    {p._imgUrl ? (
                      <img src={p._imgUrl} alt={p.name} loading="lazy" />
                    ) : (
                      <div className="thumb--placeholder">No Image</div>
                    )}
                  </div>

                  <div className="order-row__info">
                    <div className="order-row__name">{p.name}</div>
                    <div className="order-row__variant">Phân loại: —</div>

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
                  <button className="btn-delete" onClick={()=> handleCickIconShoppingCart(p.id)}> Xóa </button>
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

      <h1 onClick={handleClinkViewOrders}>Lịch sử order</h1>
      <IconGoBack />
    </div>
  );
}
