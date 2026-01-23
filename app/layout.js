import "./globals.css";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Class Attendance App",
  description: "Minimalist attendance tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DataProvider>
          <Sidebar />
          <main>{children}</main>
          <Analytics />
        </DataProvider>
      </body>
    </html>
  );
}
