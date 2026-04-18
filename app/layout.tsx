import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lullaby Lane",
  description: "Premium storytelling for parents and kids.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
