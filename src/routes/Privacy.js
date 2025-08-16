// src/pages/Privacy.jsx
import { useEffect, } from "react";
import "../styles/Privacy.scss";

export default function Privacy() {
  useEffect(() => {
      window.scrollTo(0, 0);
  })
  return (
    <main className="privacy-page">
      <article className="policy-card">
        <h1 className="policy-title">Chính sách bảo mật & Quyền riêng tư</h1>
        <p className="policy-subtitle">
          Chúng tôi tôn trọng và bảo vệ dữ liệu hình ảnh của khách hàng.
        </p>

        <div className="policy-content">
          <p>
            Các hình ảnh mà khách hàng cung cấp chỉ được sử dụng cho mục đích
            tạo sản phẩm thử đồ ảo/ghép ảnh theo yêu cầu, và tuyệt đối không
            được chia sẻ, tiết lộ hay sử dụng vào bất kỳ mục đích nào khác khi
            chưa có sự đồng ý của khách hàng.
          </p>

          <p>
            Tất cả dữ liệu (bao gồm ảnh, thông tin cá nhân liên quan) sẽ được
            xử lý bảo mật và lưu trữ trong thời gian ngắn cần thiết để hoàn
            thành dịch vụ, sau đó có thể bị xóa vĩnh viễn khỏi hệ thống. Khách
            hàng có quyền yêu cầu chúng tôi xóa hoặc ngừng sử dụng hình ảnh bất
            kỳ lúc nào.
          </p>

          <div className="section">
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp nhằm
              đảm bảo an toàn, tránh việc truy cập trái phép, chỉnh sửa hoặc
              tiết lộ dữ liệu hình ảnh của khách hàng.
            </p>
          </div>

          <p className="muted">
            Nếu có bất kỳ thắc mắc nào liên quan đến Chính sách bảo mật, vui
            lòng liên hệ với chúng tôi theo email: support@baophamuet.site
          </p>
        </div>
      </article>
    </main>
  );
}
