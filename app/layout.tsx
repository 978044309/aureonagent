import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI WorkTrial - AI 任务试工与人才验证平台",
  description: "企业先购买结果，人才用真实项目证明能力。AI 自动拆解经营问题、匹配人才、沉淀可验证职业信用。",
  keywords: ["AI WorkTrial", "AI 任务试工", "人才验证", "职业信用", "真实项目", "长期合作"],
  openGraph: {
    title: "AI WorkTrial",
    description: "先完成项目，再决定是否招聘。",
    type: "website",
    locale: "zh_CN"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
