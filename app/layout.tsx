import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ConfirmProvider } from "@/components/confirm-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Daily Stuff Manager",
  description: "A premium tasks & notes manager — Kanban board, notes, and dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ConfirmProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    toast:
                      "rounded-xl border border-border bg-card/95 backdrop-blur-xl text-card-foreground shadow-lg",
                  },
                }}
              />
            </ConfirmProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
