import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credify - Fight Misinformation on Reddit",
  description: "A Chrome extension that analyzes the credibility of Reddit posts in real-time, helping users identify potentially misleading or unverified content.",
  keywords: ["reddit", "misinformation", "credibility", "fact-check", "chrome extension"],
  authors: [{ name: "Credify Team" }],
  openGraph: {
    title: "Credify - Fight Misinformation on Reddit",
    description: "Analyze Reddit posts in real-time for credibility and misinformation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

