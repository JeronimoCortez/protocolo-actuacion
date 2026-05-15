import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata = {
  title: "Protocolo de Actuación Escolar - DAE",
  description: "Sistema integral de actuación ante situaciones emergentes en el ámbito escolar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
