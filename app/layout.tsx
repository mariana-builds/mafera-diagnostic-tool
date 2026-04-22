import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Scope your sales setup with mafera",
  description:
    "Answer a few questions about your current setup and get a detailed scope in 5 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <div className="sticky bottom-0 z-50 w-full bg-slate-100 border-t border-slate-200 py-2 px-4 text-center text-sm text-slate-500">
          Want your own diagnosis tool?{" "}
          <a
            href="mailto:mariana@mafera.de"
            className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2 transition-colors"
          >
            Email us
          </a>{" "}
          for early access.
        </div>
      </body>
    </html>
  );
}
