"use client";

import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import OrderHistory from '../components/OrderHistory';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-8">Vui lòng đăng nhập để xem trang cá nhân.</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Trang Cá Nhân</h1>
      <div className="flex items-center mb-4">
        <Image
          src={user.photoURL || "/default-avatar.png"}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="ml-4">
          <p className="text-lg font-semibold">{user.displayName}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      {/* Thêm các thông tin khác hoặc tùy chỉnh ở đây */}
      <OrderHistory/>
    </div>
  );
}
