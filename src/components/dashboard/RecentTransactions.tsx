import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Car, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  icon: typeof Coffee;
  time: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    amount: 280000,
    type: "income",
    category: "Income",
    icon: ArrowDownLeft,
    time: "Today, 9:00 AM",
  },
  {
    id: "2",
    description: "Starbucks Coffee",
    amount: 450,
    type: "expense",
    category: "Dining",
    icon: Coffee,
    time: "Today, 10:30 AM",
  },
  {
    id: "3",
    description: "Amazon Purchase",
    amount: 2499,
    type: "expense",
    category: "Shopping",
    icon: ShoppingBag,
    time: "Yesterday",
  },
  {
    id: "4",
    description: "Uber Ride",
    amount: 320,
    type: "expense",
    category: "Transport",
    icon: Car,
    time: "Yesterday",
  },
  {
    id: "5",
    description: "Restaurant Dinner",
    amount: 1850,
    type: "expense",
    category: "Dining",
    icon: Utensils,
    time: "2 days ago",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RecentTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-foreground">Recent Activity</h3>
        <Link 
          to="/transactions"
          className="text-xs text-primary hover:text-primary-glow transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <Link key={tx.id} to="/transactions">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer"
            >
            <div
              className={cn(
                "p-2 rounded-lg transition-all group-hover:scale-110",
                tx.type === "income"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <tx.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {tx.description}
              </p>
              <p className="text-xs text-muted-foreground">{tx.time}</p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-mono font-medium",
                  tx.type === "income" ? "text-success" : "text-foreground"
                )}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{tx.category}</p>
            </div>
          </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
