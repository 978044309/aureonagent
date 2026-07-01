export type BudgetRange = "0-3000" | "3000-10000" | "10000-30000" | "30000+";

export type TaskStatus = "draft" | "published" | "matching" | "in_progress" | "delivered";

export interface TaskBreakdown {
  summary: string;
  milestones: string[];
  deliverables: string[];
  risks: string[];
  suggestedQuote: {
    min: number;
    max: number;
    basis: string;
  };
}

export interface EnterpriseTask {
  id: string;
  companyName: string;
  companyContact: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  status: TaskStatus;
  createdAt: string;
  ai: TaskBreakdown;
}

export interface TalentProfile {
  id: string;
  name: string;
  contact: string;
  skills: string[];
  availability: string;
  expectedIncome: number;
  experience: string;
  createdAt: string;
}

export interface MatchResult {
  id: string;
  taskId: string;
  talentId: string;
  score: number;
  status: "recommended" | "selected" | "contacted";
  reasons: string[];
  executionSteps: string[];
  createdAt: string;
}

export interface TaskApplication {
  id: string;
  taskId: string;
  talentId: string;
  status: "applied" | "order_created" | "accepted" | "declined";
  createdAt: string;
}

export interface PlatformOrder {
  id: string;
  taskId: string;
  talentId: string;
  source: "enterprise_invite" | "talent_application";
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  talentPayout: number;
  status: "pending_payment" | "escrowed" | "in_progress" | "delivered" | "completed";
  createdAt: string;
}

export interface AppData {
  tasks: EnterpriseTask[];
  talents: TalentProfile[];
  matches: MatchResult[];
  applications: TaskApplication[];
  orders: PlatformOrder[];
}
