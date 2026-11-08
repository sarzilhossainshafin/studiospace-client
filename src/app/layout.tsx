
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import GoogleProvider from "@/components/providers/GoogleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Creative Spaces, Shared",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book inspiring creative studios, photography spaces, podcast rooms, music suites, and production studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GoogleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </GoogleProvider>
      </body>
    </html>
  );
}
