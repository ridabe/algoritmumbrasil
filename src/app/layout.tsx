import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { DataProvider } from "@/contexts/data-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Algoritmum Brasil - Soluções Tecnológicas Inovadoras",
  description: "Desenvolvemos sistemas integrados, automação e análise de dados para transformar a gestão empresarial",
  keywords: "automação, RPA, Monetrix, análise de dados, IA, gestão empresarial",
  authors: [{ name: "Algoritmum Brasil" }],
  creator: "Algoritmum Brasil",
  publisher: "Algoritmum Brasil",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://algoritmumbrasil.com.br",
    title: "Algoritmum Brasil - Soluções Tecnológicas Inovadoras",
    description: "Desenvolvemos sistemas integrados, automação e análise de dados para transformar a gestão empresarial",
    siteName: "Algoritmum Brasil",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algoritmum Brasil - Soluções Tecnológicas Inovadoras",
    description: "Desenvolvemos sistemas integrados, automação e análise de dados para transformar a gestão empresarial",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* CDN Libraries for external dependencies */}
        <script 
          src="https://cdn.jsdelivr.net/npm/date-fns@3.6.0/index.min.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/decimal.js@10.4.3/decimal.min.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/clsx@2.1.0/dist/clsx.min.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/lucide-react@0.344.0/dist/umd/lucide-react.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/recharts@2.12.0/umd/Recharts.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/zod@3.22.4/lib/index.umd.js" 
          defer
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DataProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </DataProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
