"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { db } from "@/lib/firebaseConfig"; // Import cấu hình Firebase Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

// Định nghĩa kiểu dữ liệu cho context
interface CartContextType {
  cart: IProduct[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

// Tạo context với kiểu dữ liệu CartContextType
const CartContext = createContext<CartContextType | undefined>(undefined);

// Tạo provider cho context
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<IProduct[]>([]);
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  // Tham chiếu đến document giỏ hàng trong Firestore
  const getCartDocRef = () => {
    if (!user) return null;
    return doc(db, "carts", user.uid); // Document giỏ hàng của mỗi người dùng sẽ có userId làm id
  };

  // Lưu giỏ hàng vào Firestore
  const saveCartToFirestore = async (cart: IProduct[]) => {
    if (!user) return;
    try {
      const cartRef = getCartDocRef();
      await setDoc(cartRef!, { items: cart }, { merge: true });
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào Firestore:", error);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng và lưu vào Firestore
  const addToCart = (product: IProduct) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      if (!updatedCart.some((item) => item.id === product.id)) {
        updatedCart.push({ ...product, quantity: 1 });
      }
      saveCartToFirestore(updatedCart); // Lưu vào Firestore
      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      saveCartToFirestore(updatedCart); // Cập nhật Firestore
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      saveCartToFirestore(updatedCart); // Lưu vào Firestore
      return updatedCart;
    });
  };

  // Hàm tính tổng tiền dựa trên giỏ hàng
  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const clearCart = () => {
    setCart([]); // Đặt lại giỏ hàng thành mảng trống
    saveCartToFirestore([]); // Xóa giỏ hàng trong Firestore
  };

  // Khôi phục giỏ hàng từ Firestore với error handling
  useEffect(() => {
    const loadCartFromFirestore = async () => {
      if (!user) return;
      try {
        const cartRef = getCartDocRef();
        const cartSnapshot = await getDoc(cartRef!);
        if (cartSnapshot.exists()) {
          const data = cartSnapshot.data();
          setCart(data.items || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng từ Firestore:", error);
        // Optional: Thêm thông báo lỗi cho người dùng
      }
    };

    loadCartFromFirestore();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, addToCart, getTotalPrice, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng CartContext dễ dàng hơn
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }
  return context;
};
