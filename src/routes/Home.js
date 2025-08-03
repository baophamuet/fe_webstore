import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
const server = process.env.REACT_APP_API_URL;
export default function Home() {
  const [products, setProducts] = useState([]);
  ///const { user } = useAuth(); 
  
  useEffect(() => {
    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${server}/products`, {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ",data)
        setProducts(data.data); // Lưu danh sách sản phẩm vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, []);
  
  return (
    <div className="px-8 py-6">
    <h1>Xin chào các bạn đến với SHOPPINK</h1>
    
    <div className="product-list">
        {products.map((product) => 
        (
          <ProductCard
            key={product.id}
            image={product.images ? JSON.parse(product.images)[0] : "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"}
            price={`${product.price? product.price : `Liên hệ chi tiết $`}$`}
            description={product.description}
            stock={product.stock}
            //colors={[]} // Nếu không có dữ liệu màu, để trống
            //onBuyNow={() => alert(`Mua ngay: ${product.name}`)}
            //onViewDetail={() => alert(`Xem chi tiết: ${product.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
