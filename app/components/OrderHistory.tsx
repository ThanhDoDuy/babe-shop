"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: Date;
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return; // Nếu người dùng chưa đăng nhập, không thực hiện truy vấn

      try {
        setLoading(true);

        // Tạo truy vấn lấy đơn hàng theo userId và sắp xếp theo ngày
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            createdAt: data.createdAt.toDate(), // Định dạng ngày từ Firestore Timestamp
            items: data.items as OrderItem[],
            totalAmount: data.totalAmount,
          };
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!user) {
    return <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>;
  }

  if (orders.length === 0) {
    return <p>Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Lịch Sử Mua Hàng</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-4 p-4 border rounded shadow">
            <p className="text-lg font-semibold">ID đơn hàng: {order.id}</p>
            <p>Ngày mua: {order.createdAt.toLocaleString("vi-VN")}</p>
            <p className="font-semibold mt-2">Sản phẩm:</p>
            <ul className="ml-4">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} x {item.price.toLocaleString("vi-VN")} VND
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">Tổng tiền: {order.totalAmount.toLocaleString("vi-VN")} VND</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
