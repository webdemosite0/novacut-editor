import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaCut — Desktop Video Editor",
  description: "A colorful desktop-first video editing interface built with Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
