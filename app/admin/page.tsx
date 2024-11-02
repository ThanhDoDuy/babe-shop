// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebaseConfig";
import { supabase } from "@/lib/supabaseClient";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, where } from "firebase/firestore";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Redirect non-admin users
  useEffect(() => {
    if (!user || user.email !== adminEmail) {
      alert("You do not have permission to access this page.");
      router.push("/");
    }
  }, [user, router, adminEmail]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = filterCategory
          ? query(collection(db, "products"), where("category", "==", filterCategory))
          : collection(db, "products");

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterCategory]);

  // Handle add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Handling product addition...");
      const imageUrl = await uploadImageToSupabase(); // Ensure upload completes first
      console.log("Image URL received:", imageUrl);
  
      if (!imageUrl) {
        alert("Image upload failed. Please try again.");
        return;
      }
  
      const newProduct = {
        name,
        price,
        description,
        imageUrl,
        category,
        createdAt: Timestamp.now(),
      };
  
      const docRef = await addDoc(collection(db, "products"), newProduct);
      setProducts((prev) => [...prev, { ...newProduct, id: docRef.id }]);
      setName("");
      setPrice(0);
      setDescription("");
      setImageFile(null);
      setCategory("");
      alert("Product added!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Upload image to Supabase
  const uploadImageToSupabase = async () => {
    console.log("imageFile in uploadImageToSupabase:", imageFile); // Check if imageFile is null
  
    if (!imageFile) {
      console.warn("No image file selected");
      return "";
    }
  
    const fileName = `${uuidv4()}-${imageFile.name}`;
    console.log("Uploading file to bucket 'product-images':", fileName);
  
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);
  
    if (error) {
      console.error("Error uploading image to Supabase:", error.message);
      return "";
    }
  
    const publicUrl = supabase.storage.from("product-images").getPublicUrl(data.path).data.publicUrl;
    console.log("Public URL for uploaded image:", publicUrl);
    return publicUrl || "";
  };

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      alert("Product deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>

        {/* Add Product Form */}
        <form onSubmit={handleAddProduct} className="mb-8">
          <div className="mb-4">
            <label className="block font-semibold">Product Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              console.log("Selected file:", file); // Debug log to check if file is selected
              setImageFile(file);
            }}
            className="border rounded p-2 w-full"
            required
          />
          <div className="mb-4">
            <label className="block font-semibold">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="e.g., Electronics, Clothing, Home Appliances"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Add Product
          </button>
        </form>

        {/* Filter Products by Category */}
        <div className="mb-8">
          <label className="block font-semibold">Filter by Category:</label>
          <input
            type="text"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter category name"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id} className="border rounded p-4 mb-4 flex justify-between items-center">
                <div>
                  <p><strong>{product.name}</strong> - {product.category}</p>
                  <p>{product.price.toLocaleString()} VND</p>
                  <p>{product.description}</p>
                  {product.imageUrl &&
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover mt-2"
                    />}
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
