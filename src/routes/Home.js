import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from 'react-router-dom';
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import { FaPlus } from "react-icons/fa";
import PortalModal from "../components/PortalModal";
import AddProductModal from "../components/AddProductModal";
import Loading from "../components/Loading";
import "../styles/Home.scss";

//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;
export default function Home({ searchQuery }) {
  const [rawProducts, setRawProducts] = useState([]);   // nguồn gốc
  const [products, setProducts] = useState([]);         // sau khi lọc
  const { user } = useAuth();
  const [userLogin, setUserLogin] = useState(null);
  const { pathname } = useLocation();
  const [addProduct, setAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
    // Thay state categoryOptions thành object map id → label
  const categoryLabel = {
  1: "Áo",
  2: "Quần",
  3: "Giày dép",
  4: "Khác",
};

  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452";

  // --- STATE cho bộ lọc ---
  const [filters, setFilters] = useState({
    category: "all",
    priceMin: "",
    priceMax: "",
    inStock: "all",   // all | in | out
    sort: "default",  // default | price_asc | price_desc | newest | oldest
  });

  // Lấy danh mục từ dữ liệu hiện có (category_id hoặc category?.name)
  const categoryOptions = useMemo(() => {
    const set = new Set();
    rawProducts.forEach(p => {
      const id = p.category_id ?? p.category?.id ?? null;
      if (id != null) set.add(String(id));
    });
    return Array.from(set);
  }, [rawProducts]);

  useEffect(() => {
    setUserLogin(user ?? null);
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const isSearch = !!(searchQuery && searchQuery.trim() !== "");
        const url = isSearch ? `${server}/search` : `${server}/products`;
        const opt = isSearch
          ? {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keyword: searchQuery }),
            }
          : {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            };

        const res = await fetch(url, opt);
        const data = await res.json();

        const list = Array.isArray(data?.data) ? data.data : [];
        setRawProducts(list);
        // áp filter lần đầu trên dữ liệu mới
        setProducts(applyFilters(list, filters));
      } catch (e) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Hàm áp bộ lọc trên mảng
  const applyFilters = (list, f) => {
    let out = [...list];

    // Lọc theo danh mục (nếu có category_id)
    if (f.category !== "all") {
      out = out.filter(p => String(p.category_id ?? p.category?.id ?? "") === f.category);
    }

    // Lọc khoảng giá
    const min = f.priceMin !== "" ? Number(f.priceMin) : null;
    const max = f.priceMax !== "" ? Number(f.priceMax) : null;
    if (min != null) out = out.filter(p => Number(p._priceNumber ?? p.price ?? 0) >= min);
    if (max != null) out = out.filter(p => Number(p._priceNumber ?? p.price ?? 0) <= max);

    // Lọc tồn kho
    if (f.inStock === "in") out = out.filter(p => Number(p.stock ?? 0) > 0);
    if (f.inStock === "out") out = out.filter(p => Number(p.stock ?? 0) <= 0);

    // Sắp xếp
    if (f.sort === "price_asc") {
      out.sort((a, b) => Number(a._priceNumber ?? a.price ?? 0) - Number(b._priceNumber ?? b.price ?? 0));
    } else if (f.sort === "price_desc") {
      out.sort((a, b) => Number(b._priceNumber ?? b.price ?? 0) - Number(a._priceNumber ?? a.price ?? 0));
    } else if (f.sort === "newest") {
      out.sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0));
    } else if (f.sort === "oldest") {
      out.sort((a, b) => new Date(a.created_at ?? 0) - new Date(b.created_at ?? 0));
    }

    return out;
  };

  // Khi bấm nút "Lọc"
  const handleApply = () => {
    setProducts(applyFilters(rawProducts, filters));
  };

  // Nếu muốn auto lọc khi thay đổi trường (không cần bấm nút),
  // bỏ comment useEffect dưới:
  // useEffect(() => {
  //   setProducts(applyFilters(rawProducts, filters));
  // }, [filters, rawProducts]);

  const handleButtonAddProduct = () => setAddProduct(true);
  
  return (
    <div className="home px-8 py-6">
      <h1 className="home__title">Xin chào các bạn đến với SHOPPINK</h1>
      {searchQuery ? (
        <h2 className="home__subtitle">Kết quả tìm kiếm cho: "{searchQuery}"</h2>
      ) : null}

      {/* --- Thanh bộ lọc --- */}
      <div className="filter-bar">
        {/* Danh mục */}
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="filter-select"
        >
          <option value="all">Tất cả danh mục</option>
          {categoryOptions.map((id) => (
            <option key={id} value={id}>
              Danh mục #{categoryLabel[id] ?? id}
            </option>
          ))}
        </select>

        {/* Khoảng giá */}
        <div className="filter-price">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Giá từ"
            value={filters.priceMin}
            onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
            className="filter-input"
          />
          <span className="filter-price__dash">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="đến"
            value={filters.priceMax}
            onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
            className="filter-input"
          />
        </div>

        {/* Tồn kho */}
        <select
          value={filters.inStock}
          onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.value }))}
          className="filter-select"
        >
          <option value="all">Tất cả hàng</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </select>

        {/* Sắp xếp */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="filter-select"
        >
          <option value="default">Mặc định</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

        <button onClick={handleApply} className="filter-apply-btn">
          Lọc
        </button>
      </div>

      {loading && <Loading />}

      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
            images={
              typeof product.images === "string"
                ? product.images.trim() !== ""
                  ? JSON.parse(product.images)
                  : [defaultImage]
                : Array.isArray(product.images)
                ? product.images
                : [defaultImage]
            }
            price={`${product.price ? product.price : `Liên hệ chi tiết $`}$`}
            description={product.description}
            stock={product.stock}
            user={user}
            IconHeart={user ? user.favoriteProducts?.includes(product.id) : false}
            IconCart={user ? user.cartProducts?.includes(product.id) : false}
          />
        ))}

        {userLogin && userLogin.role === "admin" && (
          <label className="product-card product-card--add" onClick={() => setAddProduct(true)}>
            <FaPlus />
            Thêm sản phẩm
          </label>
        )}
      </div>

      <PortalModal open={addProduct} onClose={() => setAddProduct(false)}>
        {userLogin == null ? (
          <p>Bạn chưa đăng nhập!</p>
        ) : userLogin.role === "user" ? (
          <p>Bạn không phải quản trị viên nhé!</p>
        ) : (
          <AddProductModal />
        )}
      </PortalModal>
    </div>
  );
}
