import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "./components/Header"; // <- the client component (has "use client")

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Max® — Portfolio",
  description: "Minimal portfolio with fixed gutters and cinematic reveals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <HeaderClient />
        {/* push content down by the measured header height */}
        <main style={{ paddingTop: "var(--header-h)" }}>{children}</main>
      </body>
    </html>
  );
}