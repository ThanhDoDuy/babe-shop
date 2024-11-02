"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { signInWithGoogle, signOutUser } from '@/utils/authService';
import { useAuth } from "../context/AuthContext"; // Import the AuthContext

export default function Header() {
  const router = useRouter();
  const { user } = useAuth(); // Get user directly from AuthContext
  const [loading, setLoading] = useState(false);

  // Access the environment variable directly in a constant
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Logging for debugging
  console.log("Admin Email from .env:", adminEmail);
  console.log("User Email:", user?.email);
  console.log("Is Admin?", user?.email === adminEmail);

  // Sign in handler
  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-pink-400 text-white">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold">
          <Link href="/">Cửa Hàng</Link>
        </h1>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-200">Trang Chủ</Link>
          <Link href="/products" className="hover:text-gray-200">Sản Phẩm</Link>
          <Link href="/about" className="hover:text-gray-200">Giới Thiệu</Link>
          <Link href="/contact" className="hover:text-gray-200">Liên hệ chúng tôi</Link>

          {/* User authenticated UI */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Image
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "User Avatar"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full hover:bg-pink-800"
                  />
                  <span className="text-sm font-medium">{user.displayName}</span>
                </div>
              </Link>

              {/* Admin or Cart Button */}
              {user.email === adminEmail ? (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-pink-500 text-sm rounded-full px-4 py-2 hover:bg-pink-600 focus:outline-none"
                >
                  Admin
                </button>
              ) : (
                <button
                  onClick={() => router.push('/cart')}
                  className="bg-pink-500 text-sm rounded-full px-4 py-2 hover:bg-pink-600 focus:outline-none"
                  title="Giỏ hàng"
                >
                  🛒 Giỏ Hàng
                </button>
              )}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-sm rounded-full px-4 py-2 hover:bg-red-600 focus:outline-none"
              >
                {loading ? "Đang đăng xuất..." : "Đăng Xuất"}
              </button>
            </div>
          ) : (
            // Guest UI
            <button
              onClick={handleSignIn}
              className="ml-4 p-2 bg-blue-500 text-sm rounded-full hover:bg-blue-600 focus:outline-none"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
