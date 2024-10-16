import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FilterStoreProvider } from "@/stores/filter-store-provider";
import AnalyticsComponent from "./analytics";
import Provider from "./provider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "로또 명당",
  description: "로또 명당 사이트",
  keywords: ['로또 명당', '로또', '로또 구매']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FilterStoreProvider>
          <Provider>
            {children}
          </Provider>
        </FilterStoreProvider>
        <AnalyticsComponent />
      </body>
    </html>
  );
}
