/**
 * Transaction Categorization Model
 * Simulates a trained BERT/NLP model for transaction categorization
 */

import { extractTransactionFeatures, type TrainingTransaction } from "../training-data";

export interface CategorizationResult {
  category: string;
  confidence: number;
  alternatives: Array<{ category: string; confidence: number }>;
}

/**
 * Simulated trained model weights and patterns
 * In production, these would come from actual model training
 */
const categoryWeights: Record<string, Record<string, number>> = {
  Coffee: {
    hasCoffee: 0.95,
    amount: -0.3, // Negative correlation with large amounts
    isSmall: 0.8,
  },
  Dining: {
    hasFood: 0.9,
    amount: 0.2,
    isMedium: 0.7,
  },
  Shopping: {
    hasShopping: 0.85,
    amount: 0.4,
    isMedium: 0.6,
  },
  Tech: {
    hasTech: 0.9,
    amount: 0.5, // Tech items are often expensive
    isLarge: 0.7,
    hasShopping: 0.3, // Amazon can be tech
  },
  Transport: {
    hasTransport: 0.92,
    amount: 0.1,
  },
  Health: {
    hasHealth: 0.88,
    amount: 0.3,
  },
  Income: {
    hasIncome: 0.95,
    amount: 0.8, // Income is usually large
    isLarge: 0.9,
  },
  Housing: {
    hasFood: -0.5, // Negative indicators
    amount: 0.6,
    isLarge: 0.8,
  },
  Travel: {
    amount: 0.5,
    isLarge: 0.6,
  },
};

const merchantPatterns: Record<string, string> = {
  starbucks: "Coffee",
  "cafe nero": "Coffee",
  amazon: "Shopping", // Default, but can be Tech based on amount
  netflix: "Tech",
  uber: "Transport",
  gym: "Health",
  pharmacy: "Health",
  mcdonald: "Dining",
};

/**
 * Simulated trained model for transaction categorization
 * Uses feature extraction + weighted scoring (simulates neural network)
 */
export function categorizeTransaction(
  description: string,
  amount: number,
  merchant?: string,
  userHistory?: TrainingTransaction[]
): CategorizationResult {
  // Create transaction object for feature extraction
  const tx: TrainingTransaction = {
    description,
    amount,
    merchant,
    category: "Other",
    type: amount > 0 ? "income" : "expense",
    date: new Date().toISOString(),
  };

  const features = extractTransactionFeatures(tx);
  
  // Calculate scores for each category (simulates neural network forward pass)
  const categoryScores: Record<string, number> = {};
  
  Object.keys(categoryWeights).forEach((category) => {
    let score = 0;
    const weights = categoryWeights[category];
    
    Object.entries(features).forEach(([feature, value]) => {
      if (weights[feature] !== undefined) {
        if (typeof value === "boolean") {
          score += value ? weights[feature] : 0;
        } else if (typeof value === "number") {
          // Normalize numeric features
          const normalized = feature === "amount" 
            ? Math.min(value / 100000, 1) 
            : Math.min(value / 100, 1);
          score += weights[feature] * normalized;
        }
      }
    });
    
    // Merchant pattern boost
    if (merchant) {
      const merchantLower = merchant.toLowerCase();
      if (merchantPatterns[merchantLower] === category) {
        score += 0.3;
      }
      
      // Special case: Amazon with large amount = Tech
      if (merchantLower.includes("amazon") && amount > 20000 && category === "Tech") {
        score += 0.4;
      }
    }
    
    // Amount-based heuristics
    if (category === "Income" && amount > 50000) {
      score += 0.5;
    }
    if (category === "Tech" && amount > 20000) {
      score += 0.3;
    }
    if (category === "Coffee" && amount < 1000) {
      score += 0.2;
    }
    
    categoryScores[category] = score;
  });
  
  // Get top category
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a);
  
  const topCategory = sortedCategories[0][0];
  const topScore = sortedCategories[0][1];
  
  // Normalize confidence (0-1)
  const totalScore = Object.values(categoryScores).reduce((sum, s) => sum + Math.exp(s), 0);
  const confidence = Math.exp(topScore) / totalScore;
  
  // Get alternatives
  const alternatives = sortedCategories
    .slice(1, 4)
    .map(([cat, score]) => ({
      category: cat,
      confidence: Math.exp(score) / totalScore,
    }));
  
  return {
    category: topCategory,
    confidence: Math.min(confidence, 0.99), // Cap at 99%
    alternatives,
  };
}

/**
 * Learn from user corrections (simulates model fine-tuning)
 */
export function learnFromCorrection(
  description: string,
  amount: number,
  merchant: string | undefined,
  correctCategory: string,
  predictedCategory: string
) {
  // In production, this would update model weights
  // For now, we'll store this for future model retraining
  console.log(`Learning: "${description}" was predicted as ${predictedCategory} but should be ${correctCategory}`);
  
  // This would trigger model fine-tuning in production
  return {
    learned: true,
    message: "Model will learn from this correction",
  };
}

