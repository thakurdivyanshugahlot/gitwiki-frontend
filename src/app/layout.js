import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

export const metadata = { title: "Git Wiki" };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-screen w-screen overflow-hidden bg-surface text-text-secondary">
          <div className="grid h-full" style={{ gridTemplateColumns: "20% 80%" }}>
            <Sidebar />
            <main className="h-full overflow-y-auto">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}