import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundPattern from "./components/BackgroundPattern";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fingerspot Attendance Dashboard",
  description: "Attendance Integration System Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ backgroundColor: "#eae8e7", color: "#1b1b1d" }}>
        <BackgroundPattern />
        {children}
      </body>
    </html>
  );
}
