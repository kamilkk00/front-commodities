// src/app/layout.js

import "./globals.css";   
import "./layout.css";    
import Link from "next/link";

export const metadata = {
  title: "Commodity Price Checker",
  description: "Check WTI, Brent or Natural Gas prices by date",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/wti" className="nav-link">WTI</Link>
            <Link href="/brent" className="nav-link">Brent</Link>
            <Link href="/" className="nav-link">Natural Gas</Link>
          </div>
        </header>
        <main>
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}