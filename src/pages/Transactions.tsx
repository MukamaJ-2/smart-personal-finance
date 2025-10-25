import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
  Mic,
  X,
  Coffee,
  ShoppingBag,
  Car,
  Utensils,
  Home,
  Smartphone,
  Plane,
  Heart,
  Briefcase,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { aiService } from "@/lib/ai/ai-service";
import { detectAnomaly } from "@/lib/ai/models/anomaly-detector";
import type { TrainingTransaction } from "@/lib/ai/training-data";
import { Badge } from "@/components/ui/badge";

const categoryIcons: Record<string, typeof Coffee> = {
  Dining: Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Coffee: Coffee,
  Housing: Home,
  Tech: Smartphone,
  Travel: Plane,
  Health: Heart,
  Income: Briefcase,
};

const categoryColors: Record<string, string> = {
  Dining: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  Shopping: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  Transport: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Coffee: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Housing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Tech: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Travel: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  Health: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Income: "bg-success/10 text-success border-success/30",
};

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  time: string;
}

const initialTransactions: Transaction[] = [
  { id: "1", description: "Salary Deposit", amount: 280000, type: "income", category: "Income", date: "2026-01-11", time: "09:00" },
  { id: "2", description: "Starbucks Coffee", amount: 450, type: "expense", category: "Coffee", date: "2026-01-11", time: "10:30" },
  { id: "3", description: "Amazon Purchase", amount: 2499, type: "expense", category: "Shopping", date: "2026-01-10", time: "14:20" },
  { id: "4", description: "Uber Ride to Office", amount: 320, type: "expense", category: "Transport", date: "2026-01-10", time: "08:45" },
  { id: "5", description: "Restaurant Dinner", amount: 1850, type: "expense", category: "Dining", date: "2026-01-09", time: "20:30" },
  { id: "6", description: "Netflix Subscription", amount: 649, type: "expense", category: "Tech", date: "2026-01-09", time: "00:00" },
  { id: "7", description: "Gym Membership", amount: 2500, type: "expense", category: "Health", date: "2026-01-08", time: "00:00" },
  { id: "8", description: "Freelance Payment", amount: 45000, type: "income", category: "Income", date: "2026-01-07", time: "16:00" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ParsedTransaction {
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

function parseNaturalLanguage(input: string): ParsedTransaction | null {
  const lower = input.toLowerCase();
  
  // Extract amount (look for numbers with k, K, or full numbers)
  const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(k|K|thousand|thousands)?/i);
  if (!amountMatch) return null;
  
  let amount = parseFloat(amountMatch[1]);
  if (amountMatch[2] && /k|thousand/i.test(amountMatch[2])) {
    amount *= 1000;
  }
  
  // Determine type
  const isIncome = /received|income|salary|payment|deposit|earned|got|paid/i.test(lower);
  const isExpense = /spent|bought|purchase|paid|expense|cost/i.test(lower);
  const type: "income" | "expense" = isIncome ? "income" : (isExpense ? "expense" : "expense");
  
  // Use AI model for categorization
  const aiResult = aiService.categorizeTransaction(input, amount);
  const category = aiResult.category;
  
  // Extract description
  let description = input.trim();
  if (description.length > 50) {
    description = description.substring(0, 50) + "...";
  }
  
  return { description, amount, type, category };
}

function QuickEntry({ onClose, onAdd }: { onClose: () => void; onAdd: (tx: Transaction) => void }) {
  const [input, setInput] = useState("");
  const parsed = input ? parseNaturalLanguage(input) : null;
  
  const handleAdd = () => {
    if (!parsed) return;
    
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: parsed.description,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      date,
      time,
    };
    
    onAdd(newTransaction);
    setInput("");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg glass-card-glow rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Quick Entry</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Natural Language Input */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "spent 450 on coffee today" or "received 45k freelance"'
              className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => {
                toast({
                  title: "Voice input",
                  description: "Voice input feature will be available soon. For now, type your transaction.",
                });
              }}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>

          {/* Parsed Preview */}
          {parsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-xl border border-primary/30 bg-primary/5"
            >
              <p className="text-xs text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                AI Parsing Preview
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[parsed.category] || Briefcase;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                  <span className="text-foreground">{parsed.description}</span>
                </div>
                <span className={cn("font-mono", parsed.type === "income" ? "text-success" : "text-destructive")}>
                  {parsed.type === "income" ? "+" : "-"}
                  {formatCurrency(parsed.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Today • Category: {parsed.category}</p>
                {(() => {
                  const aiResult = aiService.categorizeTransaction(parsed.description, parsed.amount);
                  return (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {Math.round(aiResult.confidence * 100)}% confidence
                    </Badge>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-primary/50 hover:bg-primary/5"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={!parsed}
              onClick={handleAdd}
            >
              Add Transaction
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [anomalies, setAnomalies] = useState<Record<string, { isAnomaly: boolean; severity: string; reason: string }>>({});

  // Initialize AI service with transaction data
  useEffect(() => {
    const trainingData: TrainingTransaction[] = transactions.map((tx) => ({
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
      date: tx.date,
    }));
    
    aiService.initialize(trainingData, 280000); // Default monthly income
    
    // Detect anomalies
    const anomalyMap: Record<string, { isAnomaly: boolean; severity: string; reason: string }> = {};
    transactions.forEach((tx) => {
      const trainingTx: TrainingTransaction = {
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
        type: tx.type,
        date: tx.date,
      };
      const result = detectAnomaly(trainingTx, trainingData);
      if (result.isAnomaly) {
        anomalyMap[tx.id] = {
          isAnomaly: true,
          severity: result.severity,
          reason: result.reason,
        };
      }
    });
    setAnomalies(anomalyMap);
  }, [transactions]);

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
    toast({
      title: "Transaction added",
      description: `${tx.type === "income" ? "Income" : "Expense"} of ${formatCurrency(tx.amount)} has been added.`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    toast({
      title: "Transaction deleted",
      description: tx ? `"${tx.description}" has been removed.` : "Transaction has been removed.",
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setTransactions((prev) => prev.filter((tx) => !selectedIds.includes(tx.id)));
    setSelectedIds([]);
    toast({
      title: "Transactions deleted",
      description: `${count} transaction${count > 1 ? "s" : ""} removed.`,
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tx.category === filterCategory;
    const matchesType = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const groupedByDate = filteredTransactions.reduce((acc, tx) => {
    const date = tx.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-UG", { weekday: "long", month: "short", day: "numeric" });
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Transaction Center</h1>
            <p className="text-muted-foreground text-sm mt-1">Track every flow of money</p>
          </div>
        </motion.header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-11 pr-4 py-3 bg-muted/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-border hover:border-primary/50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 rounded-lg text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(categoryIcons).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 rounded-lg text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 glass-card rounded-xl"
            >
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <div className="flex-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive-glow"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction List */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, transactions], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + groupIndex * 0.05 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
                {formatDate(date)}
              </h3>
              <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                {transactions.map((tx, index) => {
                  const Icon = categoryIcons[tx.category] || Briefcase;
                  const colorClass = categoryColors[tx.category] || "bg-muted text-muted-foreground border-border";
                  const isSelected = selectedIds.includes(tx.id);

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.03 }}
                      className={cn(
                        "flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => {
                        setSelectedIds((prev) =>
                          prev.includes(tx.id)
                            ? prev.filter((id) => id !== tx.id)
                            : [...prev, tx.id]
                        );
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                        )}
                      >
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-primary-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </div>

                      {/* Category Icon */}
                      <div className={cn("p-2.5 rounded-xl border", colorClass)}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {tx.description}
                          </p>
                          {anomalies[tx.id]?.isAnomaly && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-1.5 py-0",
                                anomalies[tx.id].severity === "high" && "border-destructive text-destructive",
                                anomalies[tx.id].severity === "medium" && "border-warning text-warning",
                                anomalies[tx.id].severity === "low" && "border-muted-foreground text-muted-foreground"
                              )}
                              title={anomalies[tx.id].reason}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              AI Alert
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-primary/30 text-primary">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {tx.time} • {tx.category}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-sm font-mono font-semibold",
                            tx.type === "income" ? "text-success" : "text-foreground"
                          )}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(tx.id);
                            // TODO: Open edit modal
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete transaction "${tx.description}"?`)) {
                              handleDeleteTransaction(tx.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickEntry(true)}
          className="fixed bottom-6 right-24 w-14 h-14 rounded-full bg-gradient-primary shadow-glow-md flex items-center justify-center z-40 hover:shadow-glow-lg transition-shadow"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </motion.button>

        {/* Quick Entry Modal */}
        <AnimatePresence>
          {showQuickEntry && (
            <QuickEntry 
              onClose={() => setShowQuickEntry(false)} 
              onAdd={handleAddTransaction}
            />
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
