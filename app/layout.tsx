import type { Metadata } from "next";
import { Inter, Quattrocento } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const quattrocento = Quattrocento({
  variable: "--font-quattrocento",
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
      <body className={`${quattrocento.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
