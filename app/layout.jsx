import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

export const metadata = {
  title: "Protocolo de Actuación Escolar",
  description: "Sistema integral de actuación ante situaciones emergentes en el ámbito escolar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
