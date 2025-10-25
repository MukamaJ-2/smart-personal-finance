/**
 * Anomaly Detection Model
 * Simulates a trained Isolation Forest model for detecting unusual transactions
 */

import type { TrainingTransaction } from "../training-data";

export interface AnomalyResult {
  isAnomaly: boolean;
  anomalyScore: number; // 0-1, higher = more anomalous
  reason: string;
  severity: "low" | "medium" | "high";
  suggestedAction?: string;
}

/**
 * Simulated trained Isolation Forest model for anomaly detection
 */
export function detectAnomaly(
  transaction: TrainingTransaction,
  historicalTransactions: TrainingTransaction[]
): AnomalyResult {
  if (historicalTransactions.length < 10) {
    // Not enough data for anomaly detection
    return {
      isAnomaly: false,
      anomalyScore: 0,
      reason: "Insufficient historical data",
      severity: "low",
    };
  }
  
  const category = transaction.category;
  const amount = transaction.amount;
  const categoryTx = historicalTransactions.filter((tx) => tx.category === category);
  
  if (categoryTx.length === 0) {
    // New category - could be anomaly
    return {
      isAnomaly: true,
      anomalyScore: 0.6,
      reason: "Transaction in new category",
      severity: "medium",
      suggestedAction: "Verify category is correct",
    };
  }
  
  // Calculate statistics for this category
  const amounts = categoryTx.map((tx) => tx.amount);
  const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  
  // Z-score calculation (simulates Isolation Forest scoring)
  const zScore = Math.abs((amount - mean) / (stdDev || 1));
  
  // Anomaly thresholds
  let isAnomaly = false;
  let severity: "low" | "medium" | "high" = "low";
  let reason = "";
  let anomalyScore = 0;
  
  if (zScore > 3) {
    // Very unusual (3+ standard deviations)
    isAnomaly = true;
    severity = "high";
    reason = `Amount (${amount} UGX) is ${zScore.toFixed(1)}x the average for ${category}`;
    anomalyScore = Math.min(zScore / 5, 1); // Normalize to 0-1
    if (amount > mean * 2) {
      reason += " - Unusually large transaction";
    } else {
      reason += " - Unusually small transaction";
    }
  } else if (zScore > 2) {
    // Moderately unusual
    isAnomaly = true;
    severity = "medium";
    reason = `Amount is ${zScore.toFixed(1)}x the average for ${category}`;
    anomalyScore = zScore / 4;
  } else if (zScore > 1.5) {
    // Slightly unusual
    isAnomaly = true;
    severity = "low";
    reason = `Slightly unusual amount for ${category}`;
    anomalyScore = zScore / 3;
  }
  
  // Check for duplicate transactions (same amount, same day)
  const sameDay = historicalTransactions.filter(
    (tx) =>
      tx.date === transaction.date &&
      Math.abs(tx.amount - amount) < 10 && // Within 10 UGX
      tx.category === category
  );
  
  if (sameDay.length > 0 && !isAnomaly) {
    isAnomaly = true;
    severity = "medium";
    reason = "Possible duplicate transaction";
    anomalyScore = 0.6;
  }
  
  // Check for unusual merchant patterns
  if (transaction.merchant) {
    const merchantTx = historicalTransactions.filter(
      (tx) => tx.merchant?.toLowerCase() === transaction.merchant?.toLowerCase()
    );
    
    if (merchantTx.length === 0 && amount > mean * 1.5) {
      isAnomaly = true;
      severity = "medium";
      reason = `First transaction with ${transaction.merchant} - verify merchant`;
      anomalyScore = Math.max(anomalyScore, 0.5);
    }
  }
  
  let suggestedAction: string | undefined;
  if (isAnomaly && severity === "high") {
    suggestedAction = "Please verify this transaction is correct";
  } else if (isAnomaly && severity === "medium") {
    suggestedAction = "Double-check this transaction";
  }
  
  return {
    isAnomaly,
    anomalyScore: Math.min(anomalyScore, 1),
    reason,
    severity,
    suggestedAction,
  };
}

/**
 * Batch anomaly detection
 */
export function detectAnomalies(
  transactions: TrainingTransaction[],
  historicalTransactions: TrainingTransaction[]
): Array<{ transaction: TrainingTransaction; anomaly: AnomalyResult }> {
  return transactions.map((tx) => ({
    transaction: tx,
    anomaly: detectAnomaly(tx, historicalTransactions),
  }));
}

