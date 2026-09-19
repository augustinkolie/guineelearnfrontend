import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SplashScreen } from "@/components/SplashScreen";

const geistSans = { variable: "font-sans" };
const geistMono = { variable: "font-mono" };

export const metadata: Metadata = {
  title: "GuinéeLearn - L'excellence au bout des doigts",
  description: "Plateforme éducative premium pour les élèves de Guinée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SplashScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
