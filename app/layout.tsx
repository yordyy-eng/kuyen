import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/constants/site-config";

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
  title: SITE_CONFIG.metadata.title,
  description: SITE_CONFIG.metadata.description,
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
