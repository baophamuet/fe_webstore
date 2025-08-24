import React, { useEffect, useState, } from "react";
import { useLocation } from 'react-router-dom';

import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import { FaPlus } from "react-icons/fa";
import PortalModal from "../components/PortalModal"; // ✅ dùng PortalModal
import AddProductModal from "../components/AddProductModal"

const server = process.env.REACT_APP_API_URL;
export default function Home({productSearch}) {
  const [products, setProducts] = useState([]);
  const { user } = useAuth(); 
  const [userLogin, setUserLogin] = useState(null);
  const { pathname } = useLocation();
  const [addProduct,setAddProduct]=  useState(false)
  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"

  // useEffect 1: chạy khi mount (fetch API)
  useEffect(() => {
    setUserLogin(user ?? null);
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi
    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
            console.log("URL đang gọi:", `${server}/products`); // Kiểm tra URL

        const response = await fetch(`${server}/products`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
           credentials: 'include', // Quan trọng
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("HTTP Status:", response.status); 
        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ",data)
        setProducts(data.data); // Lưu danh sách sản phẩm vào state


      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, [user]);





  const handleButtonAddProduct= ()=>{
    setAddProduct(true);

  }
  return (
    <div className="px-8 py-6">
    <h1>Xin chào các bạn đến với SHOPPINK</h1>
    
    <div className="product-list">
        {products.map((product) => 
        (
          <ProductCard
            key={product.id}
            productId={product.id}
            images={
                typeof product.images === "string"
                ? (product.images.trim() !== "" ? JSON.parse(product.images) : [defaultImage])
                : Array.isArray(product.images)
                ? product.images
                : [defaultImage]
            }
            price={`${product.price? product.price : `Liên hệ chi tiết $`}$`}
            description={product.description}
            stock={product.stock}
            user={user}
            IconHeart= {
              user ?
              (user.favoriteProducts?.includes(product.id) ? true : false)
              : false
            }
            IconCart= {
              user ?
              (user.cartProducts?.includes(product.id) ? true : false)
              : false
            }
            //colors={[]} // Nếu không có dữ liệu màu, để trống
            //onBuyNow={() => alert(`Mua ngay: ${product.name}`)}
            //onViewDetail={() => alert(`Xem chi tiết: ${product.name}`)}
          />
        ))}
        <label className="product-card" 
          style={{
          color:"#ccc",
          display: "flex",
          justifyContent: "center", // căn giữa ngang
          alignItems: "center",     // căn giữa dọc
        }}
        onClick={handleButtonAddProduct}
        > 
          <FaPlus ></FaPlus>
          Thêm sản phẩm
        </label>
      </div>

      {<PortalModal open={addProduct} onClose={() => setAddProduct(false)}>
    {userLogin == null 
    ? <p>Bạn chưa đăng nhập!</p> 
    : userLogin.role =="user"
    ?<p>Bạn không phải quản trị viên nhé!</p> 
    : <AddProductModal/>}
    </PortalModal>
    }  
      
    </div>
  );
}