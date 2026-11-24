
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MultiMind AI",
  description: "Five AI Models. One Question.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
