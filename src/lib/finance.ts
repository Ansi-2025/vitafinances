/**
 * Regras de negócio financeiras.
 * Todas as funções são puras e determinísticas.
 * Valores monetários são arredondados para 2 casas para evitar erros de ponto flutuante.
 */

export const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export type AmountRecord = { amount: number | string };

const num = (value: number | string | null | undefined): number => {
  const parsed = typeof value === "string" ? Number(value) : (value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const sumAmounts = (rows: AmountRecord[]): number =>
  round2(rows.reduce((total, row) => total + num(row.amount), 0));

export const calculateTotalIncome = (incomes: AmountRecord[]) => sumAmounts(incomes);
export const calculateTotalExpenses = (expenses: AmountRecord[]) => sumAmounts(expenses);

export const calculateAvailableBalance = (
  income: number,
  expenses: number,
  investments: number,
): number => round2(income - expenses - investments);

export const calculateInvestmentRate = (investments: number, income: number): number =>
  income > 0 ? round2((investments / income) * 100) : 0;

export const calculateCategoryPercentage = (categoryTotal: number, totalExpenses: number): number =>
  totalExpenses > 0 ? round2((categoryTotal / totalExpenses) * 100) : 0;

export const calculateGoalProgress = (current: number, target: number): number =>
  target > 0 ? Math.min(100, round2((current / target) * 100)) : 0;

export const calculateVariation = (current: number, previous: number): number | null =>
  previous > 0 ? round2(((current - previous) / previous) * 100) : null;

/** Converte taxa anual (%) em taxa mensal decimal equivalente. */
export const annualToMonthlyRate = (annualPercent: number): number =>
  Math.pow(1 + annualPercent / 100, 1 / 12) - 1;

/**
 * Juros compostos: FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
 * Trata corretamente r = 0.
 */
export const calculateCompoundInterest = (
  presentValue: number,
  monthlyContribution: number,
  monthlyRate: number,
  months: number,
): number => {
  if (months <= 0) return round2(presentValue);
  if (monthlyRate === 0) return round2(presentValue + monthlyContribution * months);
  const growth = Math.pow(1 + monthlyRate, months);
  return round2(presentValue * growth + monthlyContribution * ((growth - 1) / monthlyRate));
};

export type ProjectionPoint = {
  month: number;
  year: number;
  invested: number;
  total: number;
  interest: number;
};

export const calculateProjectedPatrimony = (
  presentValue: number,
  monthlyContribution: number,
  annualRatePercent: number,
  months: number,
): ProjectionPoint[] => {
  const rate = annualToMonthlyRate(annualRatePercent);
  const points: ProjectionPoint[] = [];
  for (let month = 0; month <= months; month++) {
    const total = calculateCompoundInterest(presentValue, monthlyContribution, rate, month);
    const invested = round2(presentValue + monthlyContribution * month);
    points.push({
      month,
      year: round2(month / 12),
      invested,
      total,
      interest: round2(total - invested),
    });
  }
  return points;
};

/** Aporte mensal necessário para atingir a meta na data desejada. */
export const calculateRequiredMonthlyContribution = (
  targetAmount: number,
  currentAmount: number,
  months: number,
  annualRatePercent = 0,
): number => {
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 0;
  if (months <= 0) return round2(remaining);
  const rate = annualToMonthlyRate(annualRatePercent);
  if (rate === 0) return round2(remaining / months);
  const growth = Math.pow(1 + rate, months);
  const futureOfCurrent = currentAmount * growth;
  const needed = targetAmount - futureOfCurrent;
  if (needed <= 0) return 0;
  return round2(needed / ((growth - 1) / rate));
};

/** Em quantos meses a meta é atingida mantendo o aporte atual. Retorna null se nunca. */
export const calculateMonthsToGoal = (
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number,
): number | null => {
  if (currentAmount >= targetAmount) return 0;
  if (monthlyContribution <= 0) return null;
  return Math.ceil((targetAmount - currentAmount) / monthlyContribution);
};

/* ---------- Formatação (padrão brasileiro) ---------- */

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number | string | null | undefined): string =>
  currencyFormatter.format(num(value));

export const formatPercent = (value: number | null | undefined): string =>
  `${(value ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value.slice(0, 10)}T12:00:00`) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
};

export const toNumber = num;

/** Converte texto digitado ("1.234,56") em número. */
export const parseCurrencyInput = (input: string): number => {
  const cleaned = input.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

/* ---------- Períodos ---------- */

export type PeriodKey =
  | "this-month"
  | "last-month"
  | "last-3"
  | "last-6"
  | "this-year";

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  "this-month": "Este mês",
  "last-month": "Mês anterior",
  "last-3": "Últimos 3 meses",
  "last-6": "Últimos 6 meses",
  "this-year": "Este ano",
};

const iso = (date: Date) => date.toISOString().slice(0, 10);

export type PeriodRange = { start: string; end: string; previousStart: string; previousEnd: string };

export const getPeriodRange = (period: PeriodKey, reference = new Date()): PeriodRange => {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  let start: Date;
  let end: Date;

  switch (period) {
    case "last-month":
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0);
      break;
    case "last-3":
      start = new Date(year, month - 2, 1);
      end = new Date(year, month + 1, 0);
      break;
    case "last-6":
      start = new Date(year, month - 5, 1);
      end = new Date(year, month + 1, 0);
      break;
    case "this-year":
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31);
      break;
    default:
      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
  }

  const lengthMs = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 86400000);
  const previousStart = new Date(previousEnd.getTime() - lengthMs);

  return { start: iso(start), end: iso(end), previousStart: iso(previousStart), previousEnd: iso(previousEnd) };
};

export const monthLabel = (dateStr: string): string => {
  const date = new Date(`${dateStr.slice(0, 7)}-01T12:00:00`);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
};
