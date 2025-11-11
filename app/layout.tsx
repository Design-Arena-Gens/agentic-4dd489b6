import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-200">
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
