import React, { use, useEffect, useState, } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import IconGoBack from '../components/IconGoBack';

const server = process.env.REACT_APP_API_URL;
export default function Favorite() {
  const [products, setProducts] = useState([]);
  const [fulluser, setfulluser] = useState(null);
  const { user } = useAuth(); 

  const defaultImage = "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452"
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi pathname thay đổi

    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {

      try {
            console.log("URL đang gọi:", `${server}/users/${user.id}/favorite`); // Kiểm tra URL

        const response = await fetch(`${server}/users/${user.id}/favorite`, {
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
        setfulluser(data.user); // Lưu full thông tin người dùng vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    // Gọi hàm lấy dữ liệu khi component được hiển thị lần đầu
    fetchProducts();
  }, [user]);
  
  if (user === null) {
    return <h1>Vui lòng đăng nhập để xem sản phẩm yêu thích.</h1>;
  } 
  else 
      return (
    
    <div className="px-8 py-6">
    <h1>Các sản phẩm đã thích</h1>
    
    <div className="product-list">
        {fulluser && products.map((product) => 

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
           //IconHeart= {fulluser.favoriteProducts?.includes(product.id.toString()) ? true : false}
            //IconCart={fulluser.cartProducts?.includes(product.id.toString()) ? true : false}
            IconHeart={fulluser.favoriteProducts?.includes(Number(product.id)) ? true : false}
            IconCart={fulluser.cartProducts?.includes(Number(product.id)) ? true : false}
            
            //colors={[]} // Nếu không có dữ liệu màu, để trống
            //onBuyNow={() => alert(`Mua ngay: ${product.name}`)}
            //onViewDetail={() => alert(`Xem chi tiết: ${product.name}`)}
          />
        ))
        }
      </div>
    <br />
    <IconGoBack/>
    </div>
  );
}