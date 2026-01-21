import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Class Attendance App",
  description: "Minimalist attendance tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
