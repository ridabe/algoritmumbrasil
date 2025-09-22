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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
