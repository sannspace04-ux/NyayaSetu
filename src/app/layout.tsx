import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider }     from "@/context/AuthContext";
import { MusicProvider }    from "@/context/MusicContext";
import MusicPrompt          from "@/components/shared/MusicPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Nyaya Setu | Where Justice Meets Clarity",
  description:
    "Nyaya Setu is India's legal-tech platform — AI-powered guidance, case libraries, and trusted resources for every citizen.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${libreBaskerville.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {/* MusicProvider wraps everything so audio persists across all pages */}
            <MusicProvider>
              {children}
              {/* Ambient music opt-in prompt — shown once to first-time visitors */}
              <MusicPrompt />
            </MusicProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
