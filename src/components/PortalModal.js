// components/PortalModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * PortalModal: render children vào 1 container riêng dưới document.body
 * Props:
 * - open: boolean (mở/đóng)
 * - onClose: () => void (đóng khi click nền/ESC)
 * - children: nội dung modal
 */
export default function PortalModal({ open, onClose, children }) {
  const elRef = useRef(
    typeof document !== "undefined" ? document.createElement("div") : null
  );

  // Tạo container và gắn vào body đúng 1 lần
  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof document === "undefined") return;

    el.setAttribute("data-portal", "tryon-modal");
    el.style.position = "relative"; // đảm bảo stacking context
    document.body.appendChild(el);

    return () => {
      // cleanup khi unmount component
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  // Theo dõi open: khóa/mở scroll + có thể hủy = ESC
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let originalOverflow;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (open) {
      // Khóa scroll nền
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // ESC để đóng
      window.addEventListener("keydown", onKey);
    }

    return () => {
      // Khi open trở về false → trả overflow + bỏ listener
      if (open) {
        document.body.style.overflow = originalOverflow || "";
        window.removeEventListener("keydown", onKey);
      }
    };
  }, [open, onClose]);

  if (!open || !elRef.current) return null;

  const modalUI = (
    <div className="tryon-guide-backdrop" role="dialog" aria-modal="true">
      {/* click nền để đóng */}
      <div
        className="tryon-guide-clickcatch"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* chặn click lan ra nền */}
      <div
        className="tryon-guide-modal"
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalUI, elRef.current);
}
