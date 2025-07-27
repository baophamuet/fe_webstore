import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  ///const { user } = useAuth(); 
  
  useEffect(() => {
    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://baophamuet.site:8080/products", {
          method: "GET", // hoặc không cần ghi vì GET là mặc định
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json(); // Chuyển kết quả thành object
        console.log(">>>>>>>>>> Check data:    ",data)
        setProducts(data); // Lưu danh sách sản phẩm vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, []);
  
  return (
    <div className="px-8 py-6">
    <h1>Hello from Home </h1>
    <ProductCard></ProductCard>
    </div>
  );
}
