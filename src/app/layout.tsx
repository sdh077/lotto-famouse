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
  keywords: ['로또 명당', '로또', '로또 구매',
    '로또조합기', '로또번호조합기', '로또조합시스템', '로또무료조합', '무료로또조합',
    'lotto', '로또645', 'lotto645',
    '번호조합기', '당첨확률', '번호생성기', '복권', 'LOTTO', '로또분석번호', '로또복권당첨번호', '로또복권', '로또복권당첨번호확인',
    '로또당첨번호확인', '나눔로또당첨번호', '로또복권당첨번호안내',
    '로또 번호',
    '로또 당첨번호',
    '로또 번호 추천',
    '로또 번호 분석',
    '로또 번호 조합',
    '로또 명당',
    '서울 로또',
    '경기도 로또',
    '광주 로또',
    '부산 로또',
    '대전 로또',
    '강원도 로또',
    '충청남도 로또',
    '충청북도 로또',
    '경상남도 로또',
    '경상북도 로또',
    '전라남도 로또',
    '전라북도 로또',
    '제주도 로또'
  ]
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
