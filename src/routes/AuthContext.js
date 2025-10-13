import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
//const server = process.env.REACT_APP_API_URL;

const server = `${window.location.origin}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      const response = await fetch(`${server}/logout`, {
        method: "POST",
        credentials: "include", //  cookie đính kèm
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(">>>>>>> check Logout:  ", data);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  //✅ Hàm cập nhật favoriteProducts
  const updateFavorites = (productId, action) => {
    setUser((prev) => {
      if (!prev) return prev;

      // Đảm bảo luôn lấy được mảng favorites hiện tại
      const currentFav = Array.isArray(prev.favoriteProducts)
        ? prev.favoriteProducts
        : (() => {
            try {
              return JSON.parse(prev.favoriteProducts || "[]");
            } catch {
              return [];
            }
          })();

      let newFavorites = [];

      if (action === "add") {
        // Tránh thêm trùng sản phẩm
        if (!currentFav.includes(productId)) {
          newFavorites = [...currentFav, productId];
        } else {
          newFavorites = currentFav;
        }
      }

      if (action === "remove") {
        // Chỉ giữ lại những id khác productId
        newFavorites = currentFav.filter((id) => id !== productId);
      }

      const updatedUser = { ...prev, favoriteProducts: newFavorites };

      // Lưu lại vào localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  // ✅ Hàm cập nhật cartProducts (tùy bạn dùng hay không)
  const updateCart = (productId, action) => {
    setUser((prev) => {
      if (!prev) return prev;

      // Đảm bảo luôn lấy được mảng cart hiện tại
      const currentCart = Array.isArray(prev.cartProducts)
        ? prev.cartProducts
        : (() => {
            try {
              return JSON.parse(prev.cartProducts || "[]");
            } catch {
              return [];
            }
          })();

      let newCart = [];

      if (action === "add") {
        // Tránh thêm trùng sản phẩm
        if (!currentCart.includes(productId)) {
          newCart = [...currentCart, productId];
        } else {
          newCart = currentCart;
        }
      }

      if (action === "remove") {
        // Chỉ giữ lại những id khác productId
        newCart = currentCart.filter((id) => id !== productId);
      }

      const updatedUser = { ...prev, cartProducts: newCart };

      // Lưu lại vào localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateFavorites, // ✅ thêm vào context
        updateCart, // ✅ thêm vào context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
