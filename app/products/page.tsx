// app/products/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Product } from "../admin/page";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("No such product!");
          router.push("/products"); // Redirect if product not found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return <p className="text-center">Đang tải chi tiết sản phẩm...</p>;
  }

  if (!product) {
    return <p className="text-center">Sản phẩm không tồn tại.</p>;
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 mb-2">Giá: {product.price.toLocaleString("vi-VN")} VND</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        {product.imageUrl && (
          <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="w-full h-auto object-cover rounded-lg" />
        )}
      </div>
      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Quay Lại
      </button>
    </main>
  );
}
