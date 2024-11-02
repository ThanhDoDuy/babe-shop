// app/components/Cart.tsx
"use client";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, getTotalPrice } = useCart();

  return (
    <div className="fixed top-0 right-0 bg-white border p-4 w-80 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Giỏ Hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={product.id} className="mb-2">
                <span className="font-semibold">{product.name}</span> - 
                {product.quantity} x {product.price.toLocaleString("vi-VN")} VND
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">
            Tổng tiền: {getTotalPrice().toLocaleString("vi-VN")} VND
          </div>
        </>
      )}
    </div>
  );
}
