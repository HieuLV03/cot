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

  title: {
    default: "Chí Cốt - Chia sẻ khoảnh khắc",
    template: "%s | Chí Cốt",
  },

  description:
    "Chí Cốt là ứng dụng chia sẻ ảnh với bạn bè thân thiết. Chụp, đăng và kết nối những khoảnh khắc mỗi ngày.",

  keywords: [
    "Chí Cốt",
    "Chi Cot",
    "chí cốt",
    "chi cot",
    "ứng dụng chia sẻ ảnh",
    "mạng xã hội",
    "chia sẻ khoảnh khắc",
    "bạn bè",
  ],

  openGraph: {
    title: "Chí Cốt",
    description:
      "Ứng dụng chia sẻ ảnh với bạn bè thân thiết.",
    type: "website",
    locale: "vi_VN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Chí Cốt",
    description:
      "Ứng dụng chia sẻ ảnh với bạn bè thân thiết.",
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