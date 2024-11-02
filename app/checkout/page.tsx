// app/checkout/page.tsx
"use client";

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();

  // State để lưu thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // Hàm xử lý khi người dùng nhập thông tin vào form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  // Hàm xử lý khi người dùng nhấn nút "Thanh Toán"
  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
    // Sau khi thanh toán thành công, bạn có thể xóa giỏ hàng nếu muốn.
    // Ví dụ: setCart([]); trong CartContext
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Thanh Toán</h1>

      {/* Hiển thị sản phẩm trong giỏ hàng */}
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((product) => (
              <li key={product.id} className="flex justify-between items-center mb-2">
                <span>{product.name} - {product.quantity} x {product.price.toLocaleString("vi-VN")} VND</span>
                <span>{(product.quantity * product.price).toLocaleString("vi-VN")} VND</span>
              </li>
            ))}
          </ul>
          <div className="text-lg font-bold mb-6">
            Tổng tiền: {getTotalPrice().toLocaleString("vi-VN")} VND
          </div>
        </>
      )}

      {/* Form thông tin khách hàng */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tên Khách Hàng</label>
        <input
          type="text"
          name="name"
          value={customerInfo.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Nhập tên của bạn"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Địa Chỉ</label>
        <input
          type="text"
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Nhập địa chỉ của bạn"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
        <input
          type="text"
          name="phone"
          value={customerInfo.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Nhập số điện thoại của bạn"
        />
      </div>

      {/* Nút Thanh Toán */}
      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Thanh Toán
      </button>
    </div>
  );
}
