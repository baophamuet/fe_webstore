import React, { useMemo, useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../styles/AddProductModal.scss"
// AddProductForm — single-file React component
// Fields mapped to your Sequelize model:
// name: STRING, category_id: INTEGER, description: TEXT,
// price: STRING, stock: INTEGER, images: JSON (uploaded files)
// TailwindCSS for styling.

// --- Pure validation helper (exported for testability) ---
//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;

export function validateFields(form, images) {
  const er = {};
  if (!form.name?.trim()) er.name = "Tên sản phẩm là bắt buộc";
  if (!form.category_id) er.category_id = "Vui lòng chọn danh mục";
  if (!form.price?.trim()) er.price = "Giá là bắt buộc";

  if (form.stock !== "" && !/^[-+]?\d+$/.test(String(form.stock))) {
    er.stock = "Tồn kho phải là số nguyên";
  }

  if (!images || images.length === 0) {
    er.images = "Thêm ít nhất 1 ảnh";
  }

  return er;
}

// Modal version: wrap the form inside PortalModal
// Usage example (outside):
// const [open, setOpen] = useState(false);
// <AddProductModal open={open} onClose={() => setOpen(false)} onCreated={(p)=>console.log(p)} />


export default function AddProductModal({ open, onClose, onCreated,onNotify  }) {
  // Mock categories — replace with API fetch if needed
  const categories = useMemo(
    () => [
      { id: 1, name: "Áo" },
      { id: 2, name: "Quần" },
      { id: 3, name: "Giày/Dép" },
      { id: 4, name: "Phụ kiện" },
    ],
    []
  );

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    stock: "",
  });
  const sliderSettings = useMemo(() => ({
  dots: true,
  infinite: false,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  swipeToSlide: true,
}), []);
  const [images, setImages] = useState([]); // array of File objects
  const [previews, setPreviews] = useState([]); // object URLs for preview
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles]);
    const newPreviews = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ""; // allow re-pick same files
  };

  const removeImage = (idx) => {
    setImages((arr) => arr.filter((_, i) => i !== idx));
    setPreviews((arr) => {
      const toRevoke = arr[idx];
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return arr.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const er = validateFields(form, images);
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const toPayload = () => ({
    name: form.name.trim(),
    category_id: Number(form.category_id),
    description: form.description?.trim() || "",
    price: form.price.trim(),
    stock: form.stock === "" ? 0 : parseInt(form.stock, 10),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setResult(null);

    const fd = new FormData();
    const payload = toPayload();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
    images.forEach((file) => fd.append("products_images", file, file.name));

    try {
      // 👉 Thay URL API của bạn ở đây
      const res = await fetch(`${server}/product`, 
        { method: "POST", 
          credentials: 'include',
          body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult({ type: "success", message: "Thêm sản phẩm thành công!", data });
      setForm({ name: "", category_id: "", description: "", price: "", stock: "" });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);
        const x = window.scrollX; // vị trí ngang
        const y = window.scrollY; // vị trí dọc
        window.location.reload(); // reload trang
        window.scrollTo(x, y); // quay lại vị trí cũ
    } catch (err) {
      setResult({ type: "error", message: `Lỗi khi thêm sản phẩm: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

 return (

    <div className="apm-modal">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Thêm sản phẩm</h1>
        <p className="text-xs text-gray-500">Nhập đủ thông tin bên dưới và nhấn lưu.</p>
      </div>

      {result && (
        <div
          className={`mb-3 p-3 rounded-xl text-sm ${
            result.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          } font-bold`}
        >
          {result.message}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-4 grid grid-cols-1 gap-4 apm-form"
      >
        {/* Tên */}
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Ví dụ: Áo thun basic"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục *</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>}
        </div>

        {/* Giá (string) */}
        <div>
          <label className="block text-sm font-medium mb-1">Giá *</label>
          <input
            name="price"
            type="text"
            value={form.price}
            onChange={onChange}
            placeholder="VD: 199000 hoặc 'Liên hệ'"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
        </div>

        {/* Tồn kho (int) */}
        <div>
          <label className="block text-sm font-medium mb-1">Tồn kho</label>
          <input
            name="stock"
            type="number"
            inputMode="numeric"
            value={form.stock}
            onChange={onChange}
            placeholder="VD: 100"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
        </div>

        {/* Mô tả (TEXT) */}
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={onChange}
            placeholder="Mô tả chi tiết sản phẩm..."
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ảnh (chọn nhiều file) */}
        <div>
          <label className="block text-sm font-medium mb-1">Ảnh sản phẩm *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}

          {previews.length > 0 && (
  <div className="apm-product-image">
    {previews.length > 1 ? (
      <Slider {...sliderSettings}>
        {previews.map((src, idx) => (
          <div key={idx} className="apm-image-slide">
            <img src={src} alt={`preview-${idx}`} loading="lazy" />
            <button
              type="button"
              className="apm-remove"
              onClick={() => removeImage(idx)}
            >
              Xóa
            </button>
          </div>
        ))}
      </Slider>
    ) : (
      <div className="apm-image-slide">
        <img src={previews[0]} alt="preview-0" loading="lazy" />
        <button
          type="button"
          className="apm-remove"
          onClick={() => removeImage(0)}
        >
          Xóa
        </button>
      </div>
    )}
  </div>
)}


        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50"
          >
            Đóng
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setForm({ name: "", category_id: "", description: "", price: "", stock: "" });
                setImages([]);
                setPreviews([]);
                setErrors({});
                setResult(null);
              }}
              className="rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50"
            >
              Xóa form
            </button>
            <button
              type="submit"
              disabled={submitting}
             
              className="rounded-xl px-5 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </div>
      </form>


    </div>
  
);

}

