import React, { useEffect, useMemo, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../styles/AddProductModal.scss"; // tái sử dụng style sẵn có

/**
 * EditProductModal — component chỉnh sửa sản phẩm (modal body)
 *
 * Props:
 * - open: boolean (mở/đóng modal bên ngoài)
 * - onClose: () => void
 * - productId: number | string (id sản phẩm cần sửa)
 * - initialData?: object  (tuỳ chọn — nếu đã có data thì truyền vào để tránh gọi API lần đầu)
 * - onUpdated?: (product) => void  (callback khi cập nhật thành công)
 *
 * Backend kỳ vọng:
 * - GET    /product/:id  → trả về { id, name, category_id, description, price, stock, images: [{id, url}] }
 * - PUT    /product/:id  → multipart/form-data
 *      + fields: name, category_id, description, price, stock
 *      + files : products_images (nhiều file)
 *      + remove_image_ids: JSON.stringify([id,id,...])
 *
 * LƯU Ý: Đảm bảo Multer trên backend dùng upload.array("products_images", MAX)
 */

const server = process.env.REACT_APP_API_URL;

export default function EditProductModal({ open, onClose, productId, initialData, onUpdated }) {
  // (Có thể fetch danh mục từ API; tạm dùng cứng giống AddProductModal)
  const categories = useMemo(
    () => [
      { id: 1, name: "Áo" },
      { id: 2, name: "Quần" },
      { id: 3, name: "Giày/Dép" },
      { id: 4, name: "Phụ kiện" },
    ],
    []
  );

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: false,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      swipeToSlide: true,
    }),
    []
  );

  // form fields
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    stock: "",
  });

  // ảnh đã tồn tại trong DB
  const [existingImages, setExistingImages] = useState([]); // [{id, url}]
  const [removeIds, setRemoveIds] = useState([]); // id ảnh sẽ xoá

  // ảnh mới (chưa upload)
  const [newImages, setNewImages] = useState([]); // File[]
  const [newPreviews, setNewPreviews] = useState([]); // objectURL[]

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // load data ban đầu (khi open)
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      hydrate(initialData);
      return;
    }

    console.log("Check productID:   ",productId)
    // fetch chi tiết sản phẩm nếu có productId
    if (!productId) return;
    (async () => {
      try {
        const res = await fetch(`${server}/products/${productId}`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Check editProduct:   ",data)
        hydrate(data?.data || data); // linh hoạt tuỳ response
      } catch (e) {
        setResult({ type: "error", message: `Không tải được sản phẩm #${productId}: ${e.message}` });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productId]);

  // giải phóng preview ảnh mới khi unmount
  useEffect(() => () => {
    newPreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newPreviews]);

  const hydrate = (p) => {
    setForm({
      name: p?.name ?? "",
      category_id: p?.category_id ? String(p.category_id) : "",
      description: p?.description ?? "",
      price: p?.price ?? "",
      stock: p?.stock ?? "",
    });
    setExistingImages((p?.images) ? JSON.parse(p.images) : []);
    setRemoveIds([]);
    setNewImages([]);
    setNewPreviews([]);
    setErrors({});
    setResult(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    setNewImages((prev) => [...prev, ...imageFiles]);
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...urls]);
    e.target.value = ""; // cho phép chọn lại cùng file
  };

  const removeExisting = (imgId) => {
    setRemoveIds((ids) => (ids.includes(imgId) ? ids : [...ids, imgId]));
  };

  const undoRemoveExisting = (imgId) => {
    setRemoveIds((ids) => ids.filter((id) => id !== imgId));
  };

  const removeNew = (idx) => {
    setNewImages((arr) => arr.filter((_, i) => i !== idx));
    setNewPreviews((arr) => {
      const toRevoke = arr[idx];
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return arr.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const er = {};
    if (!form.name?.trim()) er.name = "Tên sản phẩm là bắt buộc";
    if (!form.category_id) er.category_id = "Vui lòng chọn danh mục";
    if (!form.price?.trim()) er.price = "Giá là bắt buộc";
    if (form.stock !== "" && !/^[-+]?\d+$/.test(String(form.stock))) er.stock = "Tồn kho phải là số nguyên";
    // Cho phép không thêm ảnh mới nếu đã có ảnh cũ và không xoá hết
    const remainAfterDelete = existingImages.filter((img) => !removeIds.includes(img.id));
    if ((remainAfterDelete.length === 0) && newImages.length === 0) {
      er.images = "Cần có ít nhất 1 ảnh (thêm ảnh mới hoặc giữ lại ảnh cũ)";
    }
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

    // files mới: giữ nguyên field name đã dùng bên create
    newImages.forEach((file) => fd.append("products_images", file, file.name));
    if (removeIds.length > 0) {
      fd.append("remove_image_ids", JSON.stringify(removeIds));
    }

    try {
      const res = await fetch(`${server}/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult({ type: "success", message: "Cập nhật sản phẩm thành công!", data });
      onUpdated?.(data?.data || data);
    } catch (err) {
      setResult({ type: "error", message: `Lỗi khi cập nhật: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="apm-modal">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Chỉnh sửa sản phẩm</h1>
        <p className="text-xs text-gray-500">Cập nhật thông tin rồi nhấn lưu.</p>
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


        {/* Ảnh mới (local) */}
        <div>
          <label className="block text-sm font-medium mb-1">Thêm ảnh mới</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}

          {newPreviews.length > 0 && (
            <div className="apm-product-image mt-2">
              {newPreviews.length > 1 ? (
                <Slider {...sliderSettings}>
                  {newPreviews.map((src, idx) => (
                    <div key={idx} className="apm-image-slide">
                      <img src={src} alt={`new-${idx}`} loading="lazy" />
                      <button type="button" className="apm-remove" onClick={() => removeNew(idx)}>
                        Xóa
                      </button>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="apm-image-slide">
                  <img src={newPreviews[0]} alt="new-0" loading="lazy" />
                  <button type="button" className="apm-remove" onClick={() => removeNew(0)}>
                    Xóa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50">
            Đóng
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // reset về dữ liệu gốc
                if (initialData) hydrate(initialData);
              }}
              className="rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50"
            >
              Hoàn tác
            </button>
            <button type="submit" disabled={submitting} className="rounded-xl px-5 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
