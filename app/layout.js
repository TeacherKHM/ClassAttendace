import "./globals.css";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";

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
        </DataProvider>
      </body>
    </html>
  );
}
