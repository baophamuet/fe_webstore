import { useEffect, } from "react";
import "../styles/HelpPage.scss";
import {FaTshirt } from "react-icons/fa";

export default function HelpPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    })
  return (
    <div className="help-page">
      <h1>Trung tâm trợ giúp</h1>

      {/* Mua hàng */}
      <section>
        <h2>🛒 Hướng dẫn mua hàng</h2>
        <ol>
          <li>Chọn sản phẩm và nhấn <b>Thêm vào giỏ</b>.</li>
          <li>Vào giỏ hàng kiểm tra số lượng, phiên bản (màu/size).</li>
          <li>Nhấn <b>Thanh toán</b> và điền thông tin giao hàng.</li>
          <li>Chọn <b>Phương thức thanh toán</b> (xem bên dưới) và xác nhận.</li>
        </ol>
      </section>

      {/* Thanh toán QR */}
      <section>
        <h2>💳 Hướng dẫn thanh toán online (QR ngân hàng / ví điện tử)</h2>

        <div className="payment-box">
          <h3>1) Chọn phương thức “Thanh toán bằng QR”</h3>
          <p>Tại bước thanh toán, chọn <b>QR Pay</b> (hỗ trợ internet banking và các ví điện tử phổ biến).</p>

          <h3>2) Quét mã QR</h3>
          <ol>
            <li>Hệ thống hiển thị <b>mã QR động</b> chứa: số tiền, nội dung, người nhận.</li>
            <li>Mở <b>mobile banking</b> hoặc <b>ví điện tử</b> trên điện thoại và chọn chức năng <b>Quét QR</b>.</li>
            <li>Đưa camera quét mã trên màn hình (máy tính hoặc thiết bị khác).</li>
          </ol>

          <h3>3) Kiểm tra và xác nhận</h3>
          <ul>
            <li>Đảm bảo <b>số tiền</b> và <b>nội dung chuyển khoản</b> (ví dụ: <code>ORDER-12345</code>) đúng như hệ thống hiển thị.</li>
            <li>Xác nhận thanh toán trong ứng dụng ngân hàng / ví.</li>
          </ul>

          <h3>4) Xác nhận đơn hàng</h3>
          <ul>
            <li>Sau khi thanh toán thành công, đơn hàng sẽ được <b>tự động xác nhận</b> trong ~10–60 giây.</li>
            <li>Nếu quá 5 phút chưa cập nhật trạng thái, vui lòng dùng nút <b>Tải lại trạng thái</b> (nếu có) hoặc liên hệ hỗ trợ bên dưới và cung cấp <b>mã đơn hàng</b>.</li>
          </ul>

          <div className="callout">
            <p><b>Mẹo:</b> Nếu cần thanh toán trên cùng điện thoại, hãy nhấn <b>Mở app ngân hàng</b> (deep link) hoặc <b>Tải mã QR</b> rồi mở thẳng trong app để quét từ ảnh.</p>
          </div>
        </div>

        <div className="payment-faq">
          <h3>❓ Câu hỏi thường gặp</h3>
          <details>
            <summary>Ví nào và ngân hàng nào được hỗ trợ?</summary>
            <p>Hầu hết ngân hàng nội địa có <b>Internet Banking</b> và các ví điện tử phổ biến đều hỗ trợ quét QR chuẩn nội địa. Nếu app của bạn có mục “Quét QR”, bạn có thể dùng được.</p>
          </details>
          <details>
            <summary>Tôi quét QR nhưng muốn đổi số lượng/sản phẩm?</summary>
            <p>Hãy <b>quay lại giỏ hàng</b> chỉnh sửa, sau đó tạo lại mã QR mới để tránh sai lệch số tiền.</p>
          </details>
          <details>
            <summary>Quét QR xong nhưng trạng thái vẫn “chờ thanh toán”?</summary>
            <p>Đợi thêm 1–2 phút, nhấn <b>Tải lại</b>. Nếu vẫn chưa cập nhật, liên hệ hỗ trợ và cung cấp <b>mã đơn</b> + <b>sao kê/ảnh giao dịch</b>.</p>
          </details>
          <details>
            <summary>Tôi có thể chuyển khoản thủ công thay vì QR không?</summary>
            <p>Được, nhưng bạn phải nhập đúng <b>nội dung</b> theo mẫu (vd. <code>ORDER-12345</code>) để hệ thống đối soát. Khuyến nghị vẫn dùng QR để tránh sai sót.</p>
          </details>
          <details>
            <summary>An toàn thanh toán</summary>
            <p>Chúng tôi <b>không lưu thông tin đăng nhập</b> ngân hàng/ ví của bạn. Mọi thao tác xác thực diễn ra trong ứng dụng ngân hàng/ ví của bạn.</p>
          </details>
        </div>
      </section>

      {/* Liên hệ */}
      <section>
        <h2>📞 Liên hệ khi gặp vấn đề</h2>
        <p>Nếu bạn gặp lỗi hoặc cần hỗ trợ, vui lòng liên hệ:</p>
        <ul>
          <li>Email: <a href="mailto:support@aiha.website">support@aiha.website</a></li>
          <li>Hotline: <a href="tel:+89327633389">0327633389</a></li>
          <li>Fanpage: <a href="https://www.facebook.com/Ladilazy" target="_blank" rel="noreferrer">Facebook</a></li>
        </ul>
      </section>

      {/* Thử đồ */}
      <section>
        <h2>👕 Hướng dẫn thử đồ</h2>
        <ol>
          <li>Nhấn vào icon "<FaTshirt/>" để chọn ảnh của bạn. <i>Lưu ý:</i> nên chọn ảnh tự nhiên sắc nét, đủ điều kiện ánh sáng.</li>
          <li>Chọn sản phẩm (áo/quần/giày/dép…) muốn thử.</li>
          <li>Chờ AI xử lý và xem trước kết quả.</li>
          <li><i>Lưu ý:</i> Ảnh do AI tạo, có thể không hoàn toàn chính xác 100%.</li>
        </ol>
      </section>
    </div>
  );
}
