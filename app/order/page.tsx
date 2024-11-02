"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  status: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString("vi-VN") : "N/A",
          };
        }) as Order[];
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <p className="text-center text-gray-700 mt-8">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Lịch Sử Đơn Hàng</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-700">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p className="font-semibold">Mã đơn hàng: {order.id}</p>
              <p>Ngày đặt hàng: {order.createdAt}</p>
              <p>Trạng thái: {order.status}</p>
              <ul className="mt-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.quantity} x {item.price.toLocaleString("vi-VN")} VND</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")} VND</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
