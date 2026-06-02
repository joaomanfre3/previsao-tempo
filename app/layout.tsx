import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Previsão do Tempo",
  description:
    "Veja o clima atual e a previsão dos próximos 7 dias de qualquer cidade. Temperatura, sensação, umidade, vento e chance de chuva. Dados ao vivo, sem cadastro.",
  applicationName: "Previsão do Tempo",
  openGraph: {
    title: "Previsão do Tempo",
    description: "Clima atual e previsão de 7 dias de qualquer cidade. Ao vivo.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
