import type { Metadata } from "next";
import { Inter, Antic_Slab } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const as = Antic_Slab({
  variable: "--font-as",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "seemyresume",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${as.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
