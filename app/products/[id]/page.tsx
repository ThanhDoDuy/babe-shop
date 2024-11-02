// app/products/[id]/page.tsx
"use client";
import { useCart } from "@/app/context/CartContext";
import { use } from 'react';  // Import `use` từ React

const products = [
  { id: '1', name: "Sản phẩm 1", price: 100000, description: "Mô tả chi tiết sản phẩm 1" },
  { id: '2', name: "Sản phẩm 2", price: 200000, description: "Mô tả chi tiết sản phẩm 2" },
  { id: '3', name: "Sản phẩm 3", price: 300000, description: "Mô tả chi tiết sản phẩm 3" },
  { id: '4', name: "Sản phẩm 4", price: 400000, description: "Mô tả chi tiết sản phẩm 4" },
];

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  // Sử dụng `use()` để unwrap `params`
  const { id } = use(params);
  // Tìm sản phẩm theo `id`
  const product = products.find((p) => p.id === id);
  if (!product) {
    return <p className="text-center text-red-500">Sản phẩm không tồn tại!</p>;
  }

  return (
    <main className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-2">Giá: {product.price.toLocaleString("vi-VN")} VND</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <button
          onClick={() => addToCart({ ...product, quantity: 1 })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </main>
  );
}
