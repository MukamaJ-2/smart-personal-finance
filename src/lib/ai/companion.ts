import { aiService } from "./ai-service";
import { generateTrainingData } from "./training-data";

let isInitialized = false;

function ensureAiInitialized() {
  if (isInitialized) return;
  const { transactions } = generateTrainingData();
  aiService.initialize(transactions, 280000);
  isInitialized = true;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(Math.max(amount, 0));
}

function buildSpendingSummary() {
  const insights = aiService.getDashboardInsights();
  if (insights.transactionCount === 0) {
    return "I don’t have enough transaction data yet. Add a few transactions and I can start analyzing your spending patterns.";
  }

  const top = insights.topCategories.slice(0, 3);
  const topText = top.length > 0
    ? top.map((item) => `${item.category} (${item.percentage}%)`).join(", ")
    : "no dominant categories yet";

  return [
    `Based on your recent data, your top spending categories are ${topText}.`,
    `Total spending: ${formatCurrency(insights.totalSpending)} across ${insights.transactionCount} transactions.`,
    "If you'd like, I can dig deeper into a specific category."
  ].join("\n");
}

function buildBudgetTips() {
  const insights = aiService.getDashboardInsights();
  const savingsRate = Math.max(0, insights.savingsRate);
  const top = insights.topCategories.slice(0, 2);
  const topTip = top.length > 0
    ? `Focus on ${top.map((item) => item.category).join(" and ")} to unlock quick savings.`
    : "Track two categories consistently for a week to identify easy wins.";

  return [
    `Your current savings rate is ${savingsRate}%.`,
    topTip,
    "Try setting a weekly cap for discretionary categories and review mid‑week to stay on track."
  ].join("\n");
}

function buildHealthSummary() {
  const insights = aiService.getDashboardInsights();
  if (insights.totalIncome <= 0) {
    return "I need at least one income entry to estimate your financial health score.";
  }

  const savingsRate = Math.max(0, insights.savingsRate);
  const score = Math.min(95, Math.max(35, 50 + Math.round(savingsRate * 0.6)));
  return [
    `Your financial health score is ${score}/100.`,
    `Savings rate: ${savingsRate}%.`,
    "Keep income and expense entries up to date for more precise insights."
  ].join("\n");
}

function buildGoalResponse() {
  return [
    "I can run goal predictions once you add goals with a target, deadline, and monthly contribution.",
    "Add a goal and I’ll estimate completion probability with a confidence range."
  ].join("\n");
}

export function buildAiResponse(input: string) {
  ensureAiInitialized();
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("spend") || lowerInput.includes("expense")) {
    return {
      content: buildSpendingSummary(),
      suggestions: ["Show budget tips", "Analyze a category", "Set alerts"],
    };
  }

  if (lowerInput.includes("goal") || lowerInput.includes("target")) {
    return {
      content: buildGoalResponse(),
      suggestions: ["How to set a goal", "Spending analysis", "Budget tips"],
    };
  }

  if (lowerInput.includes("budget") || lowerInput.includes("tip")) {
    return {
      content: buildBudgetTips(),
      suggestions: ["Spending analysis", "Health score", "Goal progress"],
    };
  }

  if (lowerInput.includes("health") || lowerInput.includes("score")) {
    return {
      content: buildHealthSummary(),
      suggestions: ["Spending analysis", "Budget tips", "Goal progress"],
    };
  }

  return {
    content: [
      "I can help analyze spending, budgets, and goals.",
      "Ask about spending trends, budget tips, or goal progress."
    ].join("\n"),
    suggestions: ["Spending analysis", "Budget tips", "Goal progress"],
  };
}
