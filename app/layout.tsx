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
  metadataBase: new URL("https://jesthecelebration.vervast.com"),
  title: "Theodore & Jesslyn — Wedding Invitation",
  description: "You are cordially invited to celebrate the wedding of Theodore & Jesslyn.",
  icons: {
    icon: [
      { url: "/images/og-square.jpg", sizes: "800x800", type: "image/jpeg" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "800x800", type: "image/jpeg" },
    ],
  },
  openGraph: {
    title: "Theodore & Jesslyn — Wedding Invitation",
    description: "You are cordially invited to celebrate the wedding of Theodore & Jesslyn.",
    url: "https://jesthecelebration.vervast.com",
    siteName: "Theodore & Jesslyn Wedding Invitation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-square.jpg",
        width: 800,
        height: 800,
        alt: "Theodore & Jesslyn — Wedding Invitation",
        type: "image/jpeg",
      },
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Theodore & Jesslyn — Wedding Invitation",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theodore & Jesslyn — Wedding Invitation",
    description: "You are cordially invited to celebrate the wedding of Theodore & Jesslyn.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
