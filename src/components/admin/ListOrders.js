// src/pages/ListOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../routes/AuthContext";
import "../../styles/ListOrders.scss";
import IconGoBack from "../IconGoBack";

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

const ORDER_STATUSES = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

const paymentmethodS = [
  { value: "COD", label: "Tiền mặt (COD)" },
  { value: "ONLINE", label: "Chuyển khoản" },
];

export default function ListOrders() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState(""); // "true" | "false" | ""
  const [paymentMethod, setPaymentMethod] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dirtyMap, setDirtyMap] = useState({}); // { [id]: { payment, paymentmethod, status } }
  const [toast, setToast] = useState(null);

  const hasFilters = useMemo(
    () => !!(q || status || payment || paymentMethod),
    [q, status, payment, paymentMethod]
  );

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status, payment, paymentMethod]);

  // ================= API =================
  async function fetchOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${server}/orders`, {
        method: "GET", // hoặc không cần ghi vì GET là mặc định
        credentials: "include", //  cookie đính kèm
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || "Không tải được danh sách đơn hàng");

      // Kỳ vọng API trả {status: true, data: [...], total: number}
      const list = json?.data || json || [];
      setData(list);
      setTotal(json?.total ?? list.length);
      setDirtyMap({});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrder(id, patch) {
    const prevData = [...data]; // Optimistic update
    setData((d) => d.map((it) => (it.id === id ? { ...it, ...patch } : it)));

    try {
      const res = await fetch(`${server}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Cập nhật thất bại");

      setToast({ type: "success", text: `Đã cập nhật đơn #${id}` });
      setDirtyMap((m) => {
        const c = { ...m };
        delete c[id];
        return c;
      });
    } catch (e) {
      setData(prevData);
      setToast({ type: "error", text: e.message });
    }
  }

  function markDirty(id, key, value) {
    setDirtyMap((m) => ({ ...m, [id]: { ...m[id], [key]: value } }));
    setData((d) =>
      d.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );
  }

  function resetRow(id) {
    (async () => {
      try {
        const res = await fetch(`${server}/orders`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
          credentials: "include", //  cookie đính kèm
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.message || "Không tải được danh sách đơn hàng");

        // Kỳ vọng API trả {status: true, data: [...], total: number}
        const list = json?.data || json || [];
        setData(list);
        setTotal(json?.total ?? list.length);
        setDirtyMap({});
      } catch (e) {
        setToast({ type: "error", text: e.message });
      }
    })();
  }

  function applyFilters() {
    setPage(1);
    fetchOrders();
  }

  function clearFilters() {
    setQ("");
    setStatus("");
    setPayment("");
    setPaymentMethod("");
    setPage(1);
    fetchOrders();
  }

  if (!user || user.role !== "admin") {
    return <div className="ordersm">Bạn không có quyền xem trang này</div>;
  }
  return (
    <div className="ordersm">
      <div className="ordersm__head">
        <h2>Quản lý đơn hàng</h2>
        <div className="ordersm__filters">
          <input
            className="ordersm__input"
            placeholder="Tìm ID / tên / số điện thoại / địa chỉ..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <select
            className="ordersm__select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Trạng thái đơn</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className="ordersm__select"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="">Thanh toán</option>
            <option value="true">Đã thanh toán</option>
            <option value="false">Chưa thanh toán</option>
          </select>

          <select
            className="ordersm__select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Phương thức</option>
            {paymentmethodS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>

          <button
            className="ordersm__btn ordersm__btn--primary"
            onClick={applyFilters}
          >
            Lọc
          </button>
          {hasFilters && (
            <button className="ordersm__btn" onClick={clearFilters}>
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <div className="ordersm__tablewrap">
        <table className="ordersm__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày tạo</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Tổng</th>
              <th>Thanh toán</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="ordersm__loading">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={10} className="ordersm__error">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && data?.length === 0 && (
              <tr>
                <td colSpan={10} className="ordersm__empty">
                  Không có đơn hàng
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data?.map((it) => {
                const dirty = !!dirtyMap[it.id];
                return (
                  <tr
                    key={it.id}
                    className={
                      dirty
                        ? "ordersm__row ordersm__row--dirty"
                        : "ordersm__row"
                    }
                  >
                    <td>#{it.id}</td>
                    <td>{toDate(it.created_at)}</td>
                    <td className="ordersm__name">
                      {it?.user?.name || it?.customer_name || "-"}
                    </td>
                    <td>{it.phone || "-"}</td>
                    <td className="ordersm__addr" title={it.address || "-"}>
                      {it.address || "-"}
                    </td>
                    <td className="ordersm__price">
                      {toCurrency(it.total_price)}
                    </td>

                    <td>
                      <label className="ordersm__switch">
                        <input
                          type="checkbox"
                          checked={!!it.payment}
                          onChange={(e) =>
                            markDirty(it.id, "payment", e.target.checked)
                          }
                        />
                        <span className="ordersm__slider" />
                      </label>
                    </td>

                    <td>
                      <select
                        className="ordersm__cellselect"
                        value={it.paymentmethod || ""}
                        onChange={(e) =>
                          markDirty(it.id, "paymentmethod", e.target.value)
                        }
                      >
                        <option value="">Chọn phương thức</option>
                        {paymentmethodS.map((pm) => (
                          <option key={pm.value} value={pm.value}>
                            {pm.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="ordersm__cellselect"
                        value={it.status || "pending"}
                        onChange={(e) =>
                          markDirty(it.id, "status", e.target.value)
                        }
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="ordersm__actions">
                      <button
                        disabled={!dirty}
                        className="ordersm__btn ordersm__btn--primary"
                        onClick={() => updateOrder(it.id, dirtyMap[it.id])}
                      >
                        Lưu
                      </button>
                      <button
                        disabled={!dirty}
                        className="ordersm__btn ordersm__btn--ghost"
                        onClick={() => resetRow(it.id)}
                      >
                        Hoàn tác
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="ordersm__foot">
        <div className="ordersm__pagination">
          <button
            className="ordersm__btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Trước
          </button>
          <span>Trang {page}</span>
          <button
            className="ordersm__btn"
            disabled={data.length < pageSize}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau »
          </button>
        </div>

        <div className="ordersm__pagesize">
          <label>Số dòng: </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="ordersm__total">Tổng {total} đơn</div>
      </div>
      <IconGoBack />
      {toast && (
        <div
          className={`ordersm__toast ordersm__toast--${toast.type}`}
          onAnimationEnd={() => setToast(null)}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
