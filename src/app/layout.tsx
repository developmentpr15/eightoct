import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fashion Social App - Mobile Fashion Experience",
  description: "Complete fashion social platform with social feeds, competitions, wardrobe management, and more. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["Fashion", "Social App", "Style", "Wardrobe", "Competitions", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Fashion Social Team" }],
  openGraph: {
    title: "Fashion Social App",
    description: "Your style, your community - Mobile Fashion Experience",
    url: "http://localhost:3001",
    siteName: "Fashion Social",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Social App",
    description: "Your style, your community - Mobile Fashion Experience",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
