"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Đảm bảo AuthContext có sẵn
import { createOrder } from "@/utils/orderService"; // Hàm lưu đơn hàng vào Firebase Firestore
import { useState } from "react";

export default function CartPage() {
  const { cart, getTotalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý thanh toán

  const handleDecreaseQuantity = (productId: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleIncreaseQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity + 1);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán");
      router.push("/login");
      return;
    }

    setIsProcessing(true); // Bắt đầu quá trình thanh toán
    try {
      const items = cart.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      }));
      const totalAmount = getTotalPrice();

      // Gọi hàm tạo đơn hàng để lưu vào Firestore
      await createOrder(user.uid, items, totalAmount);
      alert("Đơn hàng của bạn đã được tạo thành công!");

      clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
      router.push("/orders"); // Điều hướng đến trang lịch sử đơn hàng
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán, vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false); // Kết thúc quá trình thanh toán
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Giỏ Hàng Của Bạn</h1>

      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          <ul className="mb-4">
            {cart.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center mb-4 border-b pb-2"
              >
                <span className="font-semibold">{product.name}</span>
                
                <div className="flex items-center">
                  {/* Nút giảm số lượng */}
                  <button
                    onClick={() => handleDecreaseQuantity(product.id, product.quantity)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  {/* Nút tăng số lượng */}
                  <button
                    onClick={() => handleIncreaseQuantity(product.id, product.quantity)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <span>{(product.quantity * product.price).toLocaleString("vi-VN")} VND</span>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>

          {/* Tổng tiền và nút thanh toán */}
          <div className="text-lg font-bold text-right mt-6">
            Tổng tiền: {getTotalPrice().toLocaleString("vi-VN")} VND
          </div>
          <div className="text-right mt-4">
            <button
              onClick={handleCheckout}
              disabled={isProcessing} // Vô hiệu hóa khi đang xử lý thanh toán
              className={`p-3 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? "Đang xử lý..." : "Thanh Toán Ngay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
