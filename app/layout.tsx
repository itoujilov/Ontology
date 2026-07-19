import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

// To do: Manually update this string whenever you release a new version.
const current_version = "0.0.0";

export const metadata: Metadata = {
  title: `Ontology App V${current_version}`,
  description: "This app helps you to view and develop ontology modules."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
