import { EnterpriseTask, MatchResult, TalentProfile, TaskBreakdown } from "./types";

const skillHints: Record<string, string[]> = {
  "海外获客": ["目标市场画像", "渠道假设", "触达脚本", "线索表"],
  "内容运营": ["选题策略", "内容日历", "脚本模板", "复盘指标"],
  "数据整理": ["字段清洗", "指标定义", "看板结构", "洞察摘要"],
  "AI自动化": ["流程梳理", "工具集成", "提示词方案", "测试记录"],
  "市场调研": ["竞品清单", "用户访谈", "机会判断", "结论报告"],
  "产品": ["需求澄清", "用户路径", "验收标准"],
  "设计": ["信息架构", "视觉规范", "交互原型"],
  "前端": ["页面实现", "组件交付", "响应式适配"],
  "文案": ["卖点提炼", "内容结构", "转化优化"],
  "运营": ["渠道策略", "内容排期", "数据复盘"],
  "数据分析": ["指标定义", "数据清洗", "洞察报告"],
  "AI": ["提示词方案", "自动化流程", "效果评估"]
};

export function normalizeSkills(input: string): string[] {
  return input
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function generateTaskBreakdown(title: string, description: string, budget: number, skills: string[]): TaskBreakdown {
  const hints = Array.from(new Set(skills.flatMap((skill) => skillHints[skill] ?? [`${skill}执行方案`]))).slice(0, 5);
  const complexity = description.length > 120 || skills.length >= 4 ? 1.15 : 1;
  const min = Math.max(800, Math.round((budget * 0.72 * complexity) / 100) * 100);
  const max = Math.max(min + 500, Math.round((budget * 1.08 * complexity) / 100) * 100);

  return {
    summary: `AI 判断这是一个以“${title || "真实经营问题"}”为目标的任务试工项目，适合拆成需求澄清、执行交付、结果验收和长期合作评估四个阶段。`,
    milestones: [
      "明确经营目标、输入资料、目标用户和验收口径",
      ...hints.slice(0, 3).map((hint) => `完成${hint}`),
      "提交结果包、复盘记录和长期合作建议"
    ],
    deliverables: [
      "任务执行计划与时间表",
      "可验证的项目交付结果",
      "验收清单、企业评价和能力信用记录"
    ],
    risks: [
      "目标或验收标准不清会影响结果判断",
      "资料准备延迟会压缩执行周期",
      "试工任务应聚焦真实结果，避免变成泛泛测试题"
    ],
    suggestedQuote: {
      min,
      max,
      basis: "基于问题复杂度、所需技能、交付周期和验收成本估算"
    }
  };
}

export function createMatches(task: EnterpriseTask, talents: TalentProfile[]): MatchResult[] {
  return talents
    .map((talent) => {
      const shared = talent.skills.filter((skill) => task.skills.includes(skill));
      const skillScore = shared.length / Math.max(task.skills.length, 1);
      const incomeFit = talent.expectedIncome <= task.budget ? 1 : Math.max(0.35, task.budget / Math.max(talent.expectedIncome, 1));
      const proofFit = talent.experience.length > 40 ? 1 : 0.76;
      const score = Math.round((skillScore * 62 + incomeFit * 18 + proofFit * 20) * 100) / 100;

      return {
        id: `${task.id}-${talent.id}`,
        taskId: task.id,
        talentId: talent.id,
        score,
        status: "recommended" as const,
        reasons: [
          shared.length ? `能力重合：${shared.join("、")}` : "能力重合较少，需要人工复核",
          talent.expectedIncome <= task.budget ? "期望收入在项目预算范围内" : "期望收入高于预算，需要调整范围或报价",
          `可投入时间：${talent.availability}`,
          talent.experience ? `可验证经历：${talent.experience.slice(0, 48)}${talent.experience.length > 48 ? "..." : ""}` : "尚未填写项目经历"
        ],
        executionSteps: [
          "向候选人发送经营问题、资料包和验收标准",
          "候选人确认交付范围、周期和结果样式",
          "企业选择试工人选并锁定阶段里程碑",
          "按结果交付并沉淀企业评价、复购意向和能力信用"
        ],
        createdAt: new Date().toISOString()
      };
    })
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
