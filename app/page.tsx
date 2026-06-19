"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight, BriefcaseBusiness, Check, ChevronLeft, ChevronRight, ClipboardCheck,
  FileSearch, FileUp, Menu, ShieldCheck, Sparkles, Stethoscope, Users, X
} from "lucide-react";
import { AdvisorLead, ClientIntake, LeadStatus, RiskReport } from "@/lib/types";
import { generateAIReportWithOpenAI } from "@/lib/aiReportService";

type View = "home" | "checkup" | "report" | "broker" | "dashboard";
type BrokerApplication = { name: string; city: string; contact: string; role: string; pain: string; price: string; createdAt: string };

const initial: ClientIntake = {
  profile: { name: "", age: 35, city: "", maritalStatus: "已婚", hasChildren: true, childrenCount: 1, supportsParents: false, occupation: "", selfEmployed: false },
  incomeDebt: { annualIncome: 300000, householdIncome: 500000, monthlyExpenses: 20000, mortgage: 1000000, carLoan: 0, otherDebt: 0, hasEmergencyFund: true, reserveMonths: 6 },
  assets: { cash: 0, stocks: 0, funds: 0, bonds: 0, property: 0, retirement: 0, companyEquity: 0, other: 0 },
  insurance: { hasLife: true, lifeCoverage: 500000, hasCritical: false, criticalCoverage: 0, hasMedical: true, hasAccident: false, hasAnnuity: false, hasEducation: false, annualPremium: 20000, policyUploaded: false },
  preferences: { goals: ["保单体检"], riskPreference: "平衡", investmentExperience: "一般", advisorConsent: "先看报告" }
};

const checkupSteps = ["上传保单", "家庭责任", "现有保障", "确认提交"];

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ClientIntake>(initial);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [leads, setLeads] = useState<AdvisorLead[]>([]);
  const [leadModal, setLeadModal] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aureon-intake");
      const savedReport = localStorage.getItem("aureon-report");
      const savedLeads = localStorage.getItem("aureon-leads");
      if (saved) setData(JSON.parse(saved));
      if (savedReport) setReport(JSON.parse(savedReport));
      if (savedLeads) setLeads(JSON.parse(savedLeads));
    } catch { /* Ignore invalid local demo data. */ }
  }, []);

  useEffect(() => { localStorage.setItem("aureon-intake", JSON.stringify(data)); }, [data]);

  function navigate(next: View) {
    setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generateReport() {
    const next = await generateAIReportWithOpenAI(data);
    setReport(next);
    localStorage.setItem("aureon-report", JSON.stringify(next));
    navigate("report");
  }

  return <main className="min-h-screen bg-[#f6f7f5] text-[#102b32]">
    <Header navigate={navigate} menu={menu} setMenu={setMenu} />
    {view === "home" && <Landing start={() => navigate("checkup")} broker={() => navigate("broker")} />}
    {view === "checkup" && <Checkup data={data} setData={setData} step={step} setStep={setStep} submit={generateReport} />}
    {view === "report" && report && <PolicyReport data={data} report={report} requestHelp={() => setLeadModal(true)} />}
    {view === "broker" && <BrokerPage dashboard={() => navigate("dashboard")} />}
    {view === "dashboard" && <Dashboard leads={leads} setLeads={setLeads} />}
    {leadModal && report && <LeadModal data={data} report={report} close={() => setLeadModal(false)} save={(lead) => {
      const next = [lead, ...leads]; setLeads(next); localStorage.setItem("aureon-leads", JSON.stringify(next)); setLeadModal(false); navigate("dashboard");
    }} />}
  </main>;
}

function Header({ navigate, menu, setMenu }: { navigate: (v: View) => void; menu: boolean; setMenu: (v: boolean) => void }) {
  const links: [string, View][] = [["保单体检", "checkup"], ["经纪人合作", "broker"], ["顾问工作台", "dashboard"]];
  return <header className="sticky top-0 z-40 border-b border-[#dfe5e2] bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
      <button onClick={() => navigate("home")} className="flex items-center gap-2 text-left">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#123d49] text-[#e5c477]"><Stethoscope size={18} /></span>
        <span><b className="block tracking-wide">AUREON 保单医生</b><small className="text-[10px] tracking-[.14em] text-[#6e7d80]">AI POLICY CHECKUP</small></span>
      </button>
      <nav className="hidden items-center gap-7 text-sm md:flex">{links.map(([label, target]) => <button key={target} onClick={() => navigate(target)}>{label}</button>)}<button className="primary" onClick={() => navigate("checkup")}>免费体检</button></nav>
      <button className="md:hidden" onClick={() => setMenu(!menu)}><Menu /></button>
    </div>
    {menu && <div className="grid border-t bg-white p-3 md:hidden">{links.map(([label, target]) => <button className="p-3 text-left" key={target} onClick={() => navigate(target)}>{label}</button>)}</div>}
  </header>;
}

function Landing({ start, broker }: { start: () => void; broker: () => void }) {
  return <>
    <section className="overflow-hidden bg-[radial-gradient(circle_at_80%_10%,#dceae5_0,transparent_34%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
        <div>
          <span className="tag">AI 保单体检 · 不销售保险产品</span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-.04em] sm:text-6xl">让每一份保单，<br /><span className="text-[#ad873d]">都看得懂。</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#607176]">上传保单，AI 帮你整理保障责任，识别保额不足、保障缺失和潜在重复，并生成家庭风险体检报告。</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={start} className="primary"><FileUp size={17} /> 上传保单开始体检</button><button onClick={broker} className="secondary"><BriefcaseBusiness size={17} /> 我是保险经纪人</button></div>
          <p className="mt-5 text-xs text-[#7f8d90]">仅提供教育性分析 · 不推荐具体保险、基金或理财产品 · MVP 数据仅保存在本机</p>
        </div>
        <div className="card p-6 shadow-[0_30px_80px_rgba(21,55,62,.13)]">
          <div className="flex items-start justify-between border-b pb-5"><div><small className="text-[#738286]">AI 保单体检摘要</small><h3 className="mt-1 text-lg font-semibold">家庭保障组合 · 3 份保单</h3></div><span className="rounded-full bg-[#eaf4ef] px-3 py-1 text-xs text-[#39705f]">分析完成</span></div>
          <div className="grid grid-cols-2 gap-3 py-5">{[["家庭风险", 72], ["保障完整度", 58], ["保额充足度", 46], ["保费压力", 81]].map(([label, score]) => <div className="rounded-2xl bg-[#f3f6f4] p-4" key={String(label)}><small className="text-[#718084]">{label}</small><div className="mt-2 text-3xl font-semibold">{score}<span className="text-sm text-[#8e999b]"> / 100</span></div><div className="mt-3 h-1.5 rounded bg-[#dce4e1]"><div className="h-full rounded bg-[#b7954c]" style={{ width: `${score}%` }} /></div></div>)}</div>
          <div className="rounded-2xl bg-[#123d49] p-5 text-white"><small className="text-white/60">首要关注</small><p className="mt-2 font-medium">家庭主要收入者寿险保额不足，无法完全覆盖房贷和子女责任。</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-20"><div className="text-center"><span className="tag">POLICY CHECKUP, NOT PRODUCT SALES</span><h2 className="section-title">AI 分析保单，但不替你做购买决定</h2><p className="mx-auto mt-4 max-w-2xl text-[#69797d]">先把已有保障看清楚，再决定是否需要专业人士协助。</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[[FileSearch,"看懂保障责任","将分散在保单中的保额、期限和保障责任整理成清晰摘要。"],[ShieldCheck,"识别保障问题","检查保额不足、基础保障缺失、潜在重复和保费压力。"],[ClipboardCheck,"生成家庭报告","结合家庭责任和负债，输出风险评分与下一步核对清单。"]].map(([Icon, title, body], i) => <article className="card p-7" key={String(title)}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf2ef] text-[#1d5961]"><Icon size={22} /></span><div className="mt-7 text-xs text-[#ae893e]">0{i + 1}</div><h3 className="mt-2 text-xl font-semibold">{String(title)}</h3><p className="mt-3 leading-7 text-[#68777b]">{String(body)}</p></article>)}</div></section>

    <section className="bg-[#123d49] text-white"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2"><div><span className="text-xs tracking-[.16em] text-[#dfc178]">FOR INSURANCE PROFESSIONALS</span><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">先服务 20 个经纪人，<br />再谈更大的平台。</h2><p className="mt-5 max-w-xl leading-7 text-white/65">Aureon 正在招募保险经纪人共同验证：自动整理保单、生成客户报告和辅助需求分析，究竟能节省多少时间。</p><button onClick={broker} className="mt-7 rounded-full bg-[#dfc178] px-6 py-3 font-medium text-[#123d49]">申请成为首批体验官</button></div><div className="grid gap-4 sm:grid-cols-2">{[["¥99 / 月","个人版","保单体检与客户报告"],["¥199 / 月","专业版","批量客户管理与跟进"]].map(([price, name, detail]) => <div className="rounded-2xl border border-white/15 p-6" key={name}><span className="text-2xl font-semibold text-[#dfc178]">{price}</span><h3 className="mt-5 text-lg font-semibold">{name}</h3><p className="mt-2 text-sm text-white/60">{detail}</p><small className="mt-6 block text-white/40">访谈验证价，暂未正式收费</small></div>)}</div></div></section>

    <section className="mx-auto max-w-6xl px-5 py-20"><span className="tag">PRODUCT ROADMAP</span><h2 className="section-title">从保险入口，逐步理解家庭风险</h2><div className="mt-10 grid gap-3 sm:grid-cols-5">{["保单体检","家庭风险","资产配置","退休规划","财富传承"].map((item, i) => <div className={`rounded-2xl border p-5 ${i === 0 ? "border-[#123d49] bg-[#123d49] text-white" : "border-[#dfe5e2] bg-white text-[#899497]"}`} key={item}><small>阶段 {i + 1}</small><h3 className="mt-3 font-semibold">{item}</h3>{i === 0 && <span className="mt-3 inline-block rounded-full bg-white/10 px-2 py-1 text-[10px]">当前聚焦</span>}</div>)}</div></section>
    <Footer />
  </>;
}

function Checkup({ data, setData, step, setStep, submit }: { data: ClientIntake; setData: (d: ClientIntake) => void; step: number; setStep: (n: number) => void; submit: () => void }) {
  const update = (section: keyof ClientIntake, key: string, value: unknown) => setData({ ...data, [section]: { ...(data[section] as object), [key]: value } } as ClientIntake);
  const p = data.profile, f = data.incomeDebt, ins = data.insurance;
  return <div className="mx-auto max-w-5xl px-5 py-10"><span className="tag">FREE POLICY CHECKUP</span><h1 className="mt-3 text-3xl font-semibold">AI 保单体检</h1><p className="mt-2 text-[#6f7e82]">当前 MVP 不解析文件内容，请根据保单填写关键数据完成规则分析。</p>
    <div className="my-8 flex overflow-x-auto">{checkupSteps.map((label, i) => <button key={label} onClick={() => i <= step && setStep(i)} className={`min-w-36 flex-1 border-b-2 pb-4 text-left text-sm ${step === i ? "border-[#b08b42] font-semibold" : "border-[#dce4e1] text-[#899598]"}`}><span className="mr-2">{i < step ? "✓" : i + 1}</span>{label}</button>)}</div>
    <div className="card p-6 sm:p-9"><div className="grid gap-5 md:grid-cols-2">
      {step === 0 && <div className="md:col-span-2"><label className={`grid min-h-64 cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-8 text-center ${ins.policyUploaded ? "border-[#4f806f] bg-[#edf5f1]" : "border-[#cbd6d2] bg-[#fafbf9]"}`}><div><FileUp className="mx-auto text-[#3b6b62]" size={34} /><h2 className="mt-5 text-xl font-semibold">{ins.policyUploaded ? "保单已选择" : "上传保单 PDF 或截图"}</h2><p className="mt-2 text-sm text-[#748286]">支持 PDF、JPG、PNG；演示版本仅记录上传状态，不会传输文件。</p><span className="secondary mt-5">选择文件</span></div><input className="hidden" type="file" accept=".pdf,image/*" onChange={e => update("insurance", "policyUploaded", Boolean(e.target.files?.length))} /></label><div className="mt-5 rounded-xl bg-[#f3f6f4] p-4 text-sm leading-6 text-[#5f7074]">隐私说明：MVP 数据仅保存在你的浏览器 localStorage，不上传服务器。正式版将采用加密存储、访问控制和保单脱敏。</div></div>}
      {step === 1 && <><Field label="姓名" value={p.name} onChange={v => update("profile", "name", v)} /><NumberField label="年龄" value={p.age} onChange={v => update("profile", "age", v)} /><Field label="所在城市" value={p.city} onChange={v => update("profile", "city", v)} /><Select label="婚姻状态" value={p.maritalStatus} options={["单身", "已婚", "离异"]} onChange={v => update("profile", "maritalStatus", v)} /><NumberField label="家庭年收入" value={f.householdIncome} money onChange={v => update("incomeDebt", "householdIncome", v)} /><NumberField label="房贷及其他负债" value={f.mortgage + f.carLoan + f.otherDebt} money onChange={v => update("incomeDebt", "mortgage", v)} /><Toggle label="有孩子" value={p.hasChildren} onChange={v => update("profile", "hasChildren", v)} /><Toggle label="需要赡养父母" value={p.supportsParents} onChange={v => update("profile", "supportsParents", v)} /></>}
      {step === 2 && <><Toggle label="已有寿险" value={ins.hasLife} onChange={v => update("insurance", "hasLife", v)} /><NumberField label="寿险保额" value={ins.lifeCoverage} money onChange={v => update("insurance", "lifeCoverage", v)} /><Toggle label="已有重疾险" value={ins.hasCritical} onChange={v => update("insurance", "hasCritical", v)} /><NumberField label="重疾险保额" value={ins.criticalCoverage} money onChange={v => update("insurance", "criticalCoverage", v)} /><Toggle label="已有医疗险" value={ins.hasMedical} onChange={v => update("insurance", "hasMedical", v)} /><Toggle label="已有意外险" value={ins.hasAccident} onChange={v => update("insurance", "hasAccident", v)} /><NumberField label="每年总保费" value={ins.annualPremium} money onChange={v => update("insurance", "annualPremium", v)} /><NumberField label="现金储备可覆盖月数" value={f.reserveMonths} onChange={v => update("incomeDebt", "reserveMonths", v)} /></>}
      {step === 3 && <div className="md:col-span-2"><h2 className="text-xl font-semibold">确认分析范围</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{["家庭责任与收入中断风险", "寿险保额是否充足", "重疾、医疗和意外保障缺口", "保费占收入比例与现金流压力"].map(item => <p className="flex gap-3 rounded-xl bg-[#f3f6f4] p-4" key={item}><Check className="shrink-0 text-[#3e7364]" size={18} />{item}</p>)}</div><div className="mt-6 rounded-xl border border-[#ead8b5] bg-[#fffaf0] p-4 text-sm leading-6 text-[#725b2e]">系统不会推荐任何具体保险产品、基金或投资方案。结果仅用于教育与信息整理，不构成保险、投资、税务或法律建议。</div><Select label="分析后是否愿意接受专业顾问协助" value={data.preferences.advisorConsent} options={["先看报告", "是", "否"]} onChange={v => update("preferences", "advisorConsent", v)} /></div>}
    </div><div className="mt-8 flex justify-between border-t pt-6"><button className="secondary disabled:opacity-30" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft size={17} />上一步</button>{step < 3 ? <button className="primary" onClick={() => setStep(step + 1)}>下一步<ChevronRight size={17} /></button> : <button className="primary" onClick={submit}><Sparkles size={17} />生成体检报告</button>}</div></div>
  </div>;
}

function PolicyReport({ data, report, requestHelp }: { data: ClientIntake; report: RiskReport; requestHelp: () => void }) {
  const completeness = report.insuranceGapScore;
  const scores = [["家庭风险健康度", report.familyRiskScore], ["保障完整度", completeness], ["现金流承受力", report.cashFlowHealthScore]];
  return <div className="mx-auto max-w-6xl px-5 py-10"><span className="tag">EDUCATIONAL POLICY CHECKUP</span><h1 className="mt-3 text-3xl font-semibold">{data.profile.name || "你的"}家庭保单体检报告</h1><p className="mt-2 text-sm text-[#778589]">规则引擎 v1.0 · {new Date(report.createdAt).toLocaleString("zh-CN")}</p>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{scores.map(([label, score]) => <Score key={String(label)} label={String(label)} score={Number(score)} />)}</div>
    <section className="card mt-6 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-xl font-semibold"><ShieldCheck />保障缺口分析</h2><div className="mt-5 divide-y">{report.insuranceFindings.map(f => <div className="py-5 first:pt-0" key={f.title}><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">{f.title}</h3><span className={`rounded-full px-3 py-1 text-xs ${f.level === "高" ? "bg-[#f8e8e5] text-[#9d4b45]" : f.level === "中" ? "bg-[#faf1dc] text-[#886a2c]" : "bg-[#e9f3ee] text-[#3d705f]"}`}>{f.level}风险</span></div><p className="mt-1 text-sm text-[#748286]">当前状态：{f.status}</p><p className="mt-3 text-sm leading-6">分析建议：{f.advice}</p></div>)}</div></section>
    <section className="card mt-6 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-xl font-semibold"><ClipboardCheck />下一步核对清单</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{report.actionPlan.filter(x => !x.includes("资产") && !x.includes("全球")).map((item, i) => <p className="rounded-xl border border-[#dfe5e2] p-4" key={item}><span className="mr-3 rounded-full bg-[#123d49] px-2 py-1 text-xs text-white">{i + 1}</span>{item}</p>)}</div></section>
    <section className="mt-6 rounded-3xl bg-[#123d49] p-8 text-white sm:p-10"><span className="text-xs tracking-[.15em] text-[#dfc178]">HUMAN REVIEW</span><h2 className="mt-3 text-2xl font-semibold">需要专业人士帮你进一步核对吗？</h2><p className="mt-3 max-w-2xl text-white/65">提交需求后，可由合作保险经纪人根据原始保单继续核对。平台不保证匹配结果，也不代替持牌机构提供服务。</p><button onClick={requestHelp} className="mt-6 rounded-full bg-[#dfc178] px-6 py-3 font-medium text-[#123d49]">需要顾问协助</button></section>
    <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-[#7b888b]">本报告仅为 AI 生成的教育性分析，不构成保险购买建议、投资建议、税务或法律建议。系统不推荐具体保险、基金或理财产品。</p>
  </div>;
}

function BrokerPage({ dashboard }: { dashboard: () => void }) {
  const [form, setForm] = useState<BrokerApplication>({ name: "", city: "深圳", contact: "", role: "保险经纪人", pain: "分析保单和生成方案", price: "99元/月", createdAt: "" });
  const [saved, setSaved] = useState(false);
  function submit() { const records = JSON.parse(localStorage.getItem("aureon-broker-interviews") || "[]"); localStorage.setItem("aureon-broker-interviews", JSON.stringify([{ ...form, createdAt: new Date().toISOString() }, ...records])); setSaved(true); }
  return <div className="mx-auto max-w-7xl px-5 py-14"><div className="grid gap-12 lg:grid-cols-[1fr_.9fr]"><div><span className="tag">20 BROKER INTERVIEWS</span><h1 className="mt-4 text-4xl font-semibold leading-tight">我们正在寻找首批<br />保险经纪人共创用户</h1><p className="mt-5 max-w-xl leading-7 text-[#65767a]">不是让你立刻采购软件，而是先回答一个问题：如果 AI 能自动分析保单、生成客户报告、辅助需求分析，它能否节省你每天最宝贵的时间？</p><div className="mt-8 grid gap-3">{["保单信息结构化整理", "保障缺口与重复风险提示", "一键生成客户教育报告", "客户线索与跟进状态管理"].map(x => <p className="flex gap-3 rounded-xl bg-white p-4" key={x}><Check className="text-[#3d7463]" size={18} />{x}</p>)}</div><button onClick={dashboard} className="secondary mt-7">查看顾问工作台演示<ArrowRight size={17} /></button></div><div className="card p-7"><span className="text-xs text-[#ae893e]">15 分钟产品访谈</span><h2 className="mt-2 text-2xl font-semibold">申请首批体验官</h2>{saved ? <div className="mt-8 rounded-2xl bg-[#eaf4ef] p-8 text-center"><Check className="mx-auto text-[#39705f]" /><h3 className="mt-3 font-semibold">已记录申请</h3><p className="mt-2 text-sm text-[#65776f]">演示数据已保存在当前浏览器。</p></div> : <div className="mt-6 grid gap-4"><Field label="姓名" value={form.name} onChange={v => setForm({ ...form, name: v })} /><Field label="手机 / 微信" value={form.contact} onChange={v => setForm({ ...form, contact: v })} /><Select label="所在城市" value={form.city} options={["深圳", "上海", "广州", "北京", "汕头", "其他"]} onChange={v => setForm({ ...form, city: v })} /><Select label="你的角色" value={form.role} options={["保险经纪人", "保险经纪公司", "独立代理人", "财富顾问"]} onChange={v => setForm({ ...form, role: v })} /><Select label="每天最耗时间的工作" value={form.pain} options={["分析保单和生成方案", "客户教育", "需求分析", "客户跟进", "其他"]} onChange={v => setForm({ ...form, pain: v })} /><Select label="可接受的月费" value={form.price} options={["暂不付费", "99元/月", "199元/月", "取决于效果"]} onChange={v => setForm({ ...form, price: v })} /><button className="primary justify-center disabled:opacity-40" disabled={!form.name || !form.contact} onClick={submit}>提交访谈申请</button></div>}</div></div></div>;
}

function Dashboard({ leads, setLeads }: { leads: AdvisorLead[]; setLeads: (v: AdvisorLead[]) => void }) {
  const [city, setCity] = useState("");
  const filtered = leads.filter(x => !city || x.city.includes(city)).sort((a, b) => a.report.insuranceGapScore - b.report.insuranceGapScore);
  function update(id: string, key: "status" | "note", value: string) { const next = leads.map(x => x.id === id ? { ...x, [key]: value } : x) as AdvisorLead[]; setLeads(next); localStorage.setItem("aureon-leads", JSON.stringify(next)); }
  return <div className="mx-auto max-w-7xl px-5 py-10"><span className="tag">BROKER WORKSPACE MVP</span><h1 className="mt-3 text-3xl font-semibold">保单体检客户工作台</h1><p className="mt-2 text-[#718084]">按保障缺口优先级跟进客户，记录沟通状态和经纪人备注。</p><div className="my-7 flex flex-wrap gap-3"><input className="input max-w-56" placeholder="按城市筛选" value={city} onChange={e => setCity(e.target.value)} /><div className="rounded-xl bg-white px-5 py-3 text-sm"><b className="mr-2 text-xl">{leads.length}</b>客户线索</div></div>{filtered.length === 0 ? <div className="card py-20 text-center"><Users className="mx-auto text-[#8b9995]" /><h3 className="mt-4 font-semibold">暂无体检客户</h3><p className="mt-2 text-sm text-[#748286]">用户完成报告并请求协助后，线索会进入这里。</p></div> : <div className="grid gap-4">{filtered.map(lead => <article className="card p-5" key={lead.id}><div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]"><div><h3 className="text-lg font-semibold">{lead.name}</h3><p className="text-sm text-[#748286]">{lead.city} · {lead.client.profile.age} 岁 · {lead.contact}</p><p className="mt-3 text-sm">需求：{lead.needType}</p></div><div className="grid grid-cols-2 gap-3"><Mini label="家庭风险" value={String(lead.report.familyRiskScore)} /><Mini label="保障完整度" value={String(lead.report.insuranceGapScore)} /></div><select className="input self-start" value={lead.status} onChange={e => update(lead.id, "status", e.target.value)}>{["New Lead", "Contacted", "In Progress", "Converted", "Closed"].map(x => <option key={x}>{x}</option>)}</select></div><textarea className="input mt-4" placeholder="添加经纪人备注" value={lead.note} onChange={e => update(lead.id, "note", e.target.value)} /></article>)}</div>}</div>;
}

function LeadModal({ data, report, close, save }: { data: ClientIntake; report: RiskReport; close: () => void; save: (v: AdvisorLead) => void }) {
  const [form, setForm] = useState({ name: data.profile.name, contact: "", email: "", city: data.profile.city, needType: "保单人工核对", note: "" });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#09252c]/60 p-4"><div className="w-full max-w-xl rounded-3xl bg-white p-7"><button className="float-right" onClick={close}><X /></button><span className="tag">REQUEST HUMAN REVIEW</span><h2 className="mt-2 text-2xl font-semibold">提交专业协助需求</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="姓名" value={form.name} onChange={v => setForm({ ...form, name: v })} /><Field label="手机 / 微信" value={form.contact} onChange={v => setForm({ ...form, contact: v })} /><Field label="邮箱" value={form.email} onChange={v => setForm({ ...form, email: v })} /><Field label="城市" value={form.city} onChange={v => setForm({ ...form, city: v })} /><Select label="需求" value={form.needType} options={["保单人工核对", "家庭保障需求分析", "咨询经纪人"]} onChange={v => setForm({ ...form, needType: v })} /></div><button disabled={!form.name || !form.contact} className="primary mt-6 w-full justify-center disabled:opacity-40" onClick={() => save({ ...form, id: crypto.randomUUID(), status: "New Lead" as LeadStatus, createdAt: new Date().toISOString(), client: data, report })}>提交需求</button></div></div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label><span className="label">{label}</span><input className="input" value={value} onChange={e => onChange(e.target.value)} /></label>; }
function NumberField({ label, value, onChange, money }: { label: string; value: number; onChange: (v: number) => void; money?: boolean }) { return <label><span className="label">{label}</span><div className="relative">{money && <span className="absolute left-3 top-3 text-[#7b898c]">¥</span>}<input type="number" min="0" className={`input ${money ? "pl-8" : ""}`} value={value} onChange={e => onChange(Number(e.target.value))} /></div></label>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) { return <label className="block"><span className="label">{label}</span><select className="input" value={value} onChange={e => onChange(e.target.value)}>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) { return <label className="flex items-center justify-between rounded-xl border border-[#dce3e0] p-4"><span className="text-sm font-medium">{label}</span><button type="button" onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full ${value ? "bg-[#123d49]" : "bg-[#ccd5d2]"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${value ? "left-6" : "left-1"}`} /></button></label>; }
function Score({ label, score }: { label: string; score: number }) { return <div className="card p-5"><small className="text-[#748286]">{label}</small><div className="mt-2 text-3xl font-semibold">{score}<span className="text-sm text-[#8c9799]"> / 100</span></div><div className="mt-4 h-2 rounded bg-[#e4e9e7]"><div className="h-full rounded bg-[#b4934c]" style={{ width: `${score}%` }} /></div></div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#f1f5f3] p-3"><small className="text-[#748286]">{label}</small><b className="mt-1 block">{value}</b></div>; }
function Footer() { return <footer className="border-t bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#798689] sm:flex-row sm:justify-between"><b className="text-[#123d49]">AUREON 保单医生</b><span>AI 保单体检，不销售、不推荐具体金融产品</span><span>© 2026 Aureon</span></div></footer>; }
