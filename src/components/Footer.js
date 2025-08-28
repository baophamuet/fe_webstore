import React from 'react';
import '../styles/Footer.scss';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaPlay } from 'react-icons/fa';
import logo from "../assets/images/logoweb-white.png"

const serverDomain = `${window.location.origin}/`;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
      </div>
        
      <div className="footer-bottom">
        <div className="footer-section">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="footer-section">
          <h4>Về chúng tôi</h4>
          <p><strong>SHOPPINK</strong></p>
          <p>Địa chỉ: Hà Nội</p>
          <p>Mã số doanh nghiệp: </p>
          <p>Điện thoại: 0936.75.79.62</p>
        </div>

        <div className="footer-section">
          <h4>Chính sách & Quy định</h4>
          <ul>
            <li>Cách thức đặt hàng</li>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách giao hàng</li>
            <li>Quy định đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách xử lý khiếu nại</li>
            <li>Chính sách khách hàng</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hệ thống cửa hàng</h4>
          <ul>
            <li><FaPlay/> Cửa hàng số 1 - Ninh Bình</li>
            <li>Hotline: 07xx.xx.xx.xx</li>
            <li><FaPlay/> Cửa hàng số 2 - Hà Nội</li>
            <li>Hotline: 09xx.xx.xx.xx</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Kết nối</h4>
          {
            serverDomain===`https://aiha.website/`
            ? <ul>
            <a className="social-icons" href='https://www.facebook.com/Ladilazy'target="_blank" rel="noreferrer" ><FaFacebookF/></a>
            <a className="social-icons" href='https://www.instagram.com/ladilaziii'target="_blank" rel="noreferrer" ><FaInstagram/></a>
            <a className="social-icons" href='https://www.youtube.com/'target="_blank" rel="noreferrer" ><FaYoutube/></a>
            <a className="social-icons" href='https://www.tiktok.com/' target="_blank" rel="noreferrer" ><FaTiktok/></a>
          </ul>
          : <ul>
            <a className="social-icons" href='https://www.facebook.com/baophamken'target="_blank" rel="noreferrer" ><FaFacebookF/></a>
            <a className="social-icons" href='https://www.instagram.com/baophamken'target="_blank" rel="noreferrer" ><FaInstagram/></a>
            <a className="social-icons" href='https://www.youtube.com/@pewpaidcover1930'target="_blank" rel="noreferrer" ><FaYoutube/></a>
            <a className="social-icons" href='https://www.tiktok.com/@baoy_ang' target="_blank" rel="noreferrer" ><FaTiktok/></a>
          </ul>

          }        
          <p>Đặt hàng: <strong></strong></p>
          <p>Góp ý / Khiếu nại: <strong></strong></p>
        </div>
      </div>

      <div className="footer-bottom-note">
        {
          serverDomain===`https://aiha.website/`
          ? <p>Thiết kế website bởi <a href="http://aiha.website" target="_blank" rel="noreferrer">aiha.website</a></p>
          : <p>Thiết kế website bởi <a href="http://new.baophamuet.site" target="_blank" rel="noreferrer">new.baophamuet.site</a></p>
        }
        
      </div>
    </footer>
  );
};

export default Footer;
