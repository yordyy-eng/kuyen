import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const serif = Cormorant_Garamond({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['300', '400', '600']
});

const sans = Jost({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['300', '400', '500']
});

export const metadata: Metadata = {
  title: "KUYEN — Gestión Patrimonial",
  description: "Registro oficial del patrimonio del Cementerio Municipal de Angol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-background text-primary antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
