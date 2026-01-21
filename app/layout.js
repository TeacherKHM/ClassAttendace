import "./globals.css";

export const metadata = {
  title: "Class Attendance App",
  description: "Minimalist attendance tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
