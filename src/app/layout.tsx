import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Visibility Tracker - Monitor Your Brand Across AI Platforms",
  description:
    "Track how ChatGPT, Perplexity, Claude, and Gemini mention your brand. Open source alternative to Otterly and AthenaHQ.",
  keywords: [
    "AI visibility",
    "brand monitoring",
    "ChatGPT",
    "Perplexity",
    "Claude",
    "Gemini",
    "AEO",
    "GEO",
    "AI search",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-gray-950 font-sans text-white antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
