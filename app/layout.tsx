import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chi-cot.vercel.app"),

  verification: {
    google: "iMhkqfnYHYPZ2e7ZhvNa8URs0nteVRjtS03F9CKa0sU",
  },

  title: {
    default: "Chí Cốt",
    template: "%s | Chí Cốt",
  },

  description:
    "Chí Cốt là ứng dụng chia sẻ ảnh với bạn bè thân thiết. Chụp ảnh, lưu giữ khoảnh khắc và kết nối mỗi ngày.",

  keywords: [
    "Chí Cốt",
    "Chi Cot",
    "chí cốt",
    "chi cot",
    "chia sẻ ảnh",
    "ứng dụng chia sẻ ảnh",
    "mạng xã hội",
    "bạn bè",
    "chia sẻ khoảnh khắc",
  ],

  openGraph: {
    title: "Chí Cốt",
    description:
      "Ứng dụng chia sẻ ảnh với bạn bè thân thiết.",
    url: "https://chi-cot.vercel.app",
    siteName: "Chí Cốt",
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Chí Cốt",
    description:
      "Ứng dụng chia sẻ ảnh với bạn bè thân thiết.",
  },

  alternates: {
    canonical: "https://chi-cot.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}