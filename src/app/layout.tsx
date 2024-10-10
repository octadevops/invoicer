import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar/page";
import SideBar from "./components/sidebar/page";
import Footer from "./components/footer/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Invoice Manager",
  description: "An Application to Manage Invoices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col max-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <SideBar />
            <main className="flex-1 p-4">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
