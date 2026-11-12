import "./globals.css";

export const metadata = {
  title: "Protocolo de Actuación Escolar - DAE",
  description: "Sistema integral de actuación ante situaciones emergentes en el ámbito escolar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
