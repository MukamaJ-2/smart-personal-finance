/**
 * Spending Forecasting Model
 * Simulates a trained LSTM/Time Series model for spending predictions
 */

import type { TrainingTransaction, TrainingSpendingPattern } from "../training-data";

export interface SpendingForecast {
  predictedAmount: number;
  confidenceInterval: { lower: number; upper: number };
  trend: "increasing" | "decreasing" | "stable";
  trendStrength: number; // 0-1
  seasonalFactor: number;
  daysUntilDepletion: number;
  depletionDate: string;
  riskLevel: "low" | "medium" | "high";
}

/**
 * Simulated trained LSTM model for spending forecasting
 * Uses historical patterns to predict future spending
 */
export function forecastSpending(
  category: string,
  historicalTransactions: TrainingTransaction[],
  currentAllocated: number,
  currentSpent: number,
  daysInPeriod: number = 30
): SpendingForecast {
  // Filter transactions for this category
  const categoryTx = historicalTransactions.filter(
    (tx) => tx.category === category && tx.type === "expense"
  );
  
  if (categoryTx.length === 0) {
    // No history - use default prediction
    return {
      predictedAmount: currentSpent,
      confidenceInterval: { lower: currentSpent * 0.8, upper: currentSpent * 1.2 },
      trend: "stable",
      trendStrength: 0,
      seasonalFactor: 1.0,
      daysUntilDepletion: (currentAllocated - currentSpent) / (currentSpent / daysInPeriod),
      depletionDate: new Date(Date.now() + ((currentAllocated - currentSpent) / (currentSpent / daysInPeriod)) * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "medium",
    };
  }
  
  // Calculate average daily spending
  const totalSpent = categoryTx.reduce((sum, tx) => sum + tx.amount, 0);
  const transactionCount = categoryTx.length;
  const averageTransaction = totalSpent / transactionCount;
  
  // Calculate spending velocity (transactions per day)
  const dates = categoryTx.map((tx) => new Date(tx.date).getTime()).sort();
  const timeSpan = dates.length > 1 ? (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24) : 30;
  const transactionsPerDay = transactionCount / Math.max(timeSpan, 1);
  
  // Predict monthly spending (simulates LSTM output)
  const baseMonthlySpending = averageTransaction * transactionsPerDay * 30;
  
  // Calculate trend (simulates trend analysis)
  const recentTx = categoryTx.slice(-5);
  const olderTx = categoryTx.slice(-10, -5);
  const recentAvg = recentTx.reduce((sum, tx) => sum + tx.amount, 0) / recentTx.length;
  const olderAvg = olderTx.length > 0 
    ? olderTx.reduce((sum, tx) => sum + tx.amount, 0) / olderTx.length 
    : recentAvg;
  
  const trendChange = (recentAvg - olderAvg) / olderAvg;
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (trendChange > 0.1) trend = "increasing";
  else if (trendChange < -0.1) trend = "decreasing";
  
  // Apply trend to prediction
  let predictedAmount = baseMonthlySpending;
  if (trend === "increasing") {
    predictedAmount *= (1 + Math.min(trendChange, 0.3)); // Cap at 30% increase
  } else if (trend === "decreasing") {
    predictedAmount *= (1 + Math.max(trendChange, -0.2)); // Cap at 20% decrease
  }
  
  // Seasonal factor (simulates seasonal pattern recognition)
  const currentMonth = new Date().getMonth();
  const seasonalMultipliers: Record<number, number> = {
    11: 1.15, // December - holiday spending
    0: 1.1,  // January - new year
    9: 1.05, // October - pre-holiday
  };
  const seasonalFactor = seasonalMultipliers[currentMonth] || 1.0;
  predictedAmount *= seasonalFactor;
  
  // Confidence interval (simulates model uncertainty)
  const variance = calculateVariance(categoryTx.map((tx) => tx.amount));
  const stdDev = Math.sqrt(variance);
  const confidenceMargin = stdDev * 1.96; // 95% confidence
  
  // Calculate days until depletion
  const remaining = currentAllocated - currentSpent;
  const dailySpending = predictedAmount / 30;
  const daysUntilDepletion = remaining / dailySpending;
  
  // Risk assessment
  let riskLevel: "low" | "medium" | "high" = "medium";
  const utilizationRate = currentSpent / currentAllocated;
  if (utilizationRate > 0.8 || daysUntilDepletion < 7) {
    riskLevel = "high";
  } else if (utilizationRate < 0.5 && daysUntilDepletion > 20) {
    riskLevel = "low";
  }
  
  return {
    predictedAmount: Math.round(predictedAmount),
    confidenceInterval: {
      lower: Math.round(predictedAmount - confidenceMargin),
      upper: Math.round(predictedAmount + confidenceMargin),
    },
    trend,
    trendStrength: Math.abs(trendChange),
    seasonalFactor,
    daysUntilDepletion: Math.round(daysUntilDepletion),
    depletionDate: new Date(Date.now() + daysUntilDepletion * 24 * 60 * 60 * 1000).toISOString(),
    riskLevel,
  };
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Forecast spending for multiple categories
 */
export function forecastMultipleCategories(
  categories: string[],
  historicalTransactions: TrainingTransaction[],
  allocations: Record<string, { allocated: number; spent: number }>
): Record<string, SpendingForecast> {
  const forecasts: Record<string, SpendingForecast> = {};
  
  categories.forEach((category) => {
    const allocation = allocations[category] || { allocated: 0, spent: 0 };
    forecasts[category] = forecastSpending(
      category,
      historicalTransactions,
      allocation.allocated,
      allocation.spent
    );
  });
  
  return forecasts;
}

