/**
 * Training Data Preparation
 * This module prepares and structures data for AI model training
 */

export interface TrainingTransaction {
  description: string;
  amount: number;
  merchant?: string;
  category: string;
  type: "income" | "expense";
  date: string;
  userPattern?: string; // User's typical behavior
}

export interface TrainingSpendingPattern {
  category: string;
  amounts: number[];
  dates: string[];
  frequencies: number[]; // Transactions per week
  seasonalFactors: Record<string, number>; // Month -> multiplier
}

export interface TrainingGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  deadline: string;
  achieved: boolean;
  actualCompletionDate?: string;
  spendingPatterns: TrainingSpendingPattern[];
}

export interface TrainingBudget {
  category: string;
  allocated: number;
  actualSpent: number[];
  income: number;
  goals: string[];
  success: boolean; // Whether budget was maintained
}

/**
 * Generate synthetic training data based on realistic patterns
 * In production, this would come from actual user data
 */
export function generateTrainingData() {
  // Transaction categorization training data
  const transactionTrainingData: TrainingTransaction[] = [
    // Coffee/Drinks
    { description: "Starbucks Coffee", amount: 450, merchant: "Starbucks", category: "Coffee", type: "expense", date: "2026-01-11" },
    { description: "Cafe Nero", amount: 380, merchant: "Cafe Nero", category: "Coffee", type: "expense", date: "2026-01-10" },
    { description: "Coffee Shop", amount: 520, merchant: "Local Cafe", category: "Coffee", type: "expense", date: "2026-01-09" },
    
    // Dining
    { description: "Restaurant Dinner", amount: 1850, merchant: "Restaurant", category: "Dining", type: "expense", date: "2026-01-09" },
    { description: "Lunch at Pizza Place", amount: 1200, merchant: "Pizza Place", category: "Dining", type: "expense", date: "2026-01-08" },
    { description: "Fast Food", amount: 650, merchant: "McDonald's", category: "Dining", type: "expense", date: "2026-01-07" },
    
    // Shopping
    { description: "Amazon Purchase", amount: 2499, merchant: "Amazon", category: "Shopping", type: "expense", date: "2026-01-10" },
    { description: "Online Shopping", amount: 1500, merchant: "Online Store", category: "Shopping", type: "expense", date: "2026-01-06" },
    { description: "Clothing Store", amount: 3200, merchant: "Fashion Store", category: "Shopping", type: "expense", date: "2026-01-05" },
    
    // Tech
    { description: "Netflix Subscription", amount: 649, merchant: "Netflix", category: "Tech", type: "expense", date: "2026-01-09" },
    { description: "Software Purchase", amount: 4500, merchant: "App Store", category: "Tech", type: "expense", date: "2026-01-04" },
    { description: "Amazon - Laptop", amount: 45000, merchant: "Amazon", category: "Tech", type: "expense", date: "2026-01-03" },
    
    // Transport
    { description: "Uber Ride", amount: 320, merchant: "Uber", category: "Transport", type: "expense", date: "2026-01-10" },
    { description: "Taxi", amount: 450, merchant: "Taxi Service", category: "Transport", type: "expense", date: "2026-01-05" },
    { description: "Fuel Station", amount: 2500, merchant: "Gas Station", category: "Transport", type: "expense", date: "2026-01-02" },
    
    // Health
    { description: "Gym Membership", amount: 2500, merchant: "Gym", category: "Health", type: "expense", date: "2026-01-08" },
    { description: "Pharmacy", amount: 1200, merchant: "Pharmacy", category: "Health", type: "expense", date: "2026-01-07" },
    { description: "Doctor Visit", amount: 3500, merchant: "Clinic", category: "Health", type: "expense", date: "2026-01-06" },
    
    // Income
    { description: "Salary Deposit", amount: 280000, merchant: "Employer", category: "Income", type: "income", date: "2026-01-11" },
    { description: "Freelance Payment", amount: 45000, merchant: "Client", category: "Income", type: "income", date: "2026-01-07" },
    { description: "Investment Return", amount: 15000, merchant: "Bank", category: "Income", type: "income", date: "2026-01-05" },
  ];

  return {
    transactions: transactionTrainingData,
    // Add more training data types as needed
  };
}

/**
 * Extract features from transaction for model training
 */
export function extractTransactionFeatures(tx: TrainingTransaction) {
  const description = tx.description.toLowerCase();
  const amount = tx.amount;
  const merchant = tx.merchant?.toLowerCase() || "";
  
  return {
    // Text features
    hasCoffee: /coffee|cafe|starbucks|nero/i.test(description + merchant),
    hasFood: /restaurant|dining|food|lunch|dinner|pizza|mcdonald/i.test(description + merchant),
    hasShopping: /amazon|purchase|shopping|store|buy/i.test(description + merchant),
    hasTech: /netflix|software|app|laptop|tech|subscription/i.test(description + merchant),
    hasTransport: /uber|taxi|ride|fuel|gas|transport/i.test(description + merchant),
    hasHealth: /gym|pharmacy|doctor|health|medical|fitness/i.test(description + merchant),
    hasIncome: /salary|payment|deposit|salary|freelance|income/i.test(description + merchant),
    
    // Amount features
    amount: amount,
    amountLog: Math.log10(amount + 1),
    isLarge: amount > 10000,
    isSmall: amount < 1000,
    isMedium: amount >= 1000 && amount <= 10000,
    
    // Pattern features
    merchantLength: merchant.length,
    descriptionLength: description.length,
    hasNumbers: /\d/.test(description),
  };
}

/**
 * Prepare spending pattern data for forecasting models
 */
export function prepareSpendingPatternData(transactions: TrainingTransaction[]) {
  const patterns: Record<string, TrainingSpendingPattern> = {};
  
  transactions.forEach((tx) => {
    if (tx.type === "expense" && !patterns[tx.category]) {
      patterns[tx.category] = {
        category: tx.category,
        amounts: [],
        dates: [],
        frequencies: [],
        seasonalFactors: {},
      };
    }
    
    if (tx.type === "expense") {
      patterns[tx.category].amounts.push(tx.amount);
      patterns[tx.category].dates.push(tx.date);
    }
  });
  
  // Calculate monthly averages and seasonal factors
  Object.values(patterns).forEach((pattern) => {
    const monthlyTotal = pattern.amounts.reduce((sum, amt) => sum + amt, 0);
    pattern.frequencies = [monthlyTotal / 30]; // Average daily
  });
  
  return Object.values(patterns);
}

