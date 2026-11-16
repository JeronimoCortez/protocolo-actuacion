import "./globals.css";

export const metadata = {
  title: "Protocolo de Actuación Escolar - DAE",
  description: "Sistema integral de actuación ante situaciones emergentes en el ámbito escolar.",
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Protocolo DAE",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
