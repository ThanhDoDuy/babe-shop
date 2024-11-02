// app/layout.tsx
"use client";

import Header from './components/Header';
import './globals.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <Providers> {/* Bao bọc toàn bộ ứng dụng với Providers */}
          <Header /> {/* Gọi header từ component con */}
          <main className="flex-grow container mx-auto px-6 py-8">
            {children}
          </main>
          <footer className="bg-pink-400 text-white text-center py-4">
            <p>&copy; 2023 Cửa Hàng Thương Mại Điện Tử</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
