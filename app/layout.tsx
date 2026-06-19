import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://978044309.github.io/aureonagent/"),
  title: "Aureon 保单医生 - AI 保单体检",
  description: "上传保单，使用 AI 整理保障责任、识别保额不足、保障缺失和潜在重复，生成家庭风险体检报告。",
  keywords: ["AI 保单体检", "保单分析", "家庭保障", "保险经纪人工具", "保障缺口", "Aureon 保单医生"],
  alternates: {
    canonical: "https://978044309.github.io/aureonagent/"
  },
  openGraph: {
    title: "Aureon 保单医生 - AI 保单体检",
    description: "看懂保障责任，识别保障缺口，生成家庭风险体检报告。",
    url: "https://978044309.github.io/aureonagent/",
    siteName: "Aureon 保单医生",
    locale: "zh_CN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={inter.className}>{children}</body></html>;
}
