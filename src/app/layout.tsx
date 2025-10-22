import type { Metadata } from "next";
import { Poppins, Alumni_Sans } from "next/font/google";
import "./globals.css";
import "./high-contrast.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const alumniSans = Alumni_Sans({
  variable: "--font-alumni",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "La Tazza",
  description: "PLACEHOLDER",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${alumniSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
