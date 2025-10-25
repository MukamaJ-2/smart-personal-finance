/**
 * Goal Achievement Prediction Model
 * Simulates a trained regression + Monte Carlo model for goal predictions
 */

import type { TrainingTransaction, TrainingGoal } from "../training-data";
import { forecastSpending } from "./spending-forecaster";

export interface GoalPrediction {
  completionProbability: number; // 0-1
  predictedCompletionDate: string;
  confidenceInterval: { lower: string; upper: string };
  recommendedContribution: number;
  riskFactors: string[];
  successLikelihood: "very-high" | "high" | "medium" | "low" | "very-low";
  monthsToComplete: number;
  accelerationOpportunities: Array<{
    action: string;
    impact: number; // days saved
    confidence: number;
  }>;
}

/**
 * Simulated trained model for goal achievement prediction
 * Uses historical patterns + Monte Carlo simulation
 */
export function predictGoalAchievement(
  goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    deadline: string;
  },
  historicalTransactions: TrainingTransaction[],
  monthlyIncome: number,
  activeGoals: Array<{ monthlyContribution: number }>
): GoalPrediction {
  const remaining = goal.targetAmount - goal.currentAmount;
  const now = new Date();
  const deadline = new Date(goal.deadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate required monthly contribution
  const monthsUntilDeadline = daysUntilDeadline / 30;
  const requiredMonthly = remaining / monthsUntilDeadline;
  
  // Base prediction (simulates regression model)
  const currentContribution = goal.monthlyContribution;
  const monthsAtCurrentRate = remaining / currentContribution;
  const predictedCompletionDate = new Date(
    now.getTime() + monthsAtCurrentRate * 30 * 24 * 60 * 60 * 1000
  );
  
  // Calculate probability using Monte Carlo simulation (simulated)
  const simulations = 1000;
  let successCount = 0;
  
  // Simulate various scenarios
  for (let i = 0; i < simulations; i++) {
    // Add randomness to contribution (simulates income variability)
    const variability = 0.1; // 10% variability
    const simulatedContribution = currentContribution * (1 + (Math.random() - 0.5) * variability * 2);
    
    // Simulate spending changes affecting savings
    const spendingVariability = 0.05; // 5% spending variability
    const effectiveContribution = simulatedContribution * (1 - (Math.random() - 0.5) * spendingVariability * 2);
    
    const simulatedMonths = remaining / Math.max(effectiveContribution, currentContribution * 0.5);
    const simulatedCompletion = new Date(now.getTime() + simulatedMonths * 30 * 24 * 60 * 60 * 1000);
    
    if (simulatedCompletion <= deadline) {
      successCount++;
    }
  }
  
  const completionProbability = successCount / simulations;
  
  // Calculate confidence interval (simulates prediction intervals)
  const stdDev = monthsAtCurrentRate * 0.15; // 15% standard deviation
  const lowerMonths = monthsAtCurrentRate - 1.96 * stdDev;
  const upperMonths = monthsAtCurrentRate + 1.96 * stdDev;
  
  const confidenceInterval = {
    lower: new Date(now.getTime() + lowerMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
    upper: new Date(now.getTime() + upperMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  
  // Risk factors
  const riskFactors: string[] = [];
  if (currentContribution < requiredMonthly * 0.9) {
    riskFactors.push("Current contribution is below required rate");
  }
  if (completionProbability < 0.7) {
    riskFactors.push("Low probability of on-time completion");
  }
  if (daysUntilDeadline < 60 && remaining > goal.currentAmount) {
    riskFactors.push("Tight deadline with significant remaining amount");
  }
  
  // Recommended contribution (simulates optimization)
  const recommendedContribution = Math.max(
    requiredMonthly * 1.1, // 10% buffer
    currentContribution * 1.05 // At least 5% increase
  );
  
  // Success likelihood
  let successLikelihood: "very-high" | "high" | "medium" | "low" | "very-low";
  if (completionProbability >= 0.9) successLikelihood = "very-high";
  else if (completionProbability >= 0.75) successLikelihood = "high";
  else if (completionProbability >= 0.5) successLikelihood = "medium";
  else if (completionProbability >= 0.25) successLikelihood = "low";
  else successLikelihood = "very-low";
  
  // Acceleration opportunities (simulates spending analysis)
  const accelerationOpportunities: Array<{ action: string; impact: number; confidence: number }> = [];
  
  // Analyze spending patterns for savings opportunities
  const categorySpending: Record<string, number> = {};
  historicalTransactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });
  
  // Find top spending categories that could be reduced
  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  topCategories.forEach(([category, amount]) => {
    const monthlyAmount = (amount / 30) * 30; // Estimate monthly
    const potentialSavings = monthlyAmount * 0.2; // 20% reduction
    const daysSaved = (potentialSavings / recommendedContribution) * 30;
    
    if (daysSaved > 5) { // Only suggest if saves more than 5 days
      accelerationOpportunities.push({
        action: `Reduce ${category} spending by 20%`,
        impact: Math.round(daysSaved),
        confidence: 0.7,
      });
    }
  });
  
  return {
    completionProbability,
    predictedCompletionDate: predictedCompletionDate.toISOString(),
    confidenceInterval,
    recommendedContribution: Math.round(recommendedContribution),
    riskFactors,
    successLikelihood,
    monthsToComplete: Math.round(monthsAtCurrentRate * 10) / 10,
    accelerationOpportunities,
  };
}

/**
 * Predict multiple goals
 */
export function predictMultipleGoals(
  goals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    deadline: string;
  }>,
  historicalTransactions: TrainingTransaction[],
  monthlyIncome: number
): Record<string, GoalPrediction> {
  const predictions: Record<string, GoalPrediction> = {};
  
  goals.forEach((goal) => {
    predictions[goal.name] = predictGoalAchievement(
      goal,
      historicalTransactions,
      monthlyIncome,
      goals.map((g) => ({ monthlyContribution: g.monthlyContribution }))
    );
  });
  
  return predictions;
}

