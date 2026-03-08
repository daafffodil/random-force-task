import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Random Force Task",
  description: "Gamified random task draw with countdown execution mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
