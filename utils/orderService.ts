// utils/orderService.ts
"use client";

import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Timestamp;
  status: string;
}

export async function createOrder(userId: string, items: OrderItem[], totalAmount: number) {
  try {
    const order: Order = {
      userId,
      items,
      totalAmount,
      createdAt: Timestamp.now(),
      status: "Pending", // Bạn có thể cập nhật trạng thái nếu cần
    };

    const docRef = await addDoc(collection(db, "orders"), order);
    console.log("Order created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
