import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Target, Zap, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Today's Balance",
    value: "USh 2,45,680",
    change: "+USh 12,400",
    isPositive: true,
    icon: Wallet,
    color: "primary",
    link: "/transactions",
  },
  {
    label: "Monthly Health",
    value: "87",
    suffix: "/100",
    change: "+5 pts",
    isPositive: true,
    icon: Zap,
    color: "success",
    link: "/reports",
  },
  {
    label: "Active Goals",
    value: "3",
    suffix: " goals",
    change: "85% on track",
    isPositive: true,
    icon: Target,
    color: "accent",
    link: "/goals",
  },
  {
    label: "Next Deadline",
    value: "14",
    suffix: " days",
    change: "Emergency Fund",
    isPositive: null,
    icon: Calendar,
    color: "secondary",
    link: "/goals",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    glow: "shadow-glow-sm",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    glow: "shadow-glow-success",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    glow: "shadow-glow-warning",
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    glow: "shadow-glow-secondary",
  },
};

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];
        return (
          <Link
            key={stat.label}
            to={stat.link}
            className="block"
          >
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 hover:glass-card-glow transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${colors.bg} ${colors.glow} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              {stat.isPositive !== null && (
                <div className={`flex items-center gap-1 text-xs ${stat.isPositive ? "text-success" : "text-destructive"}`}>
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className={`font-mono text-2xl font-bold ${colors.text} text-glow-sm`}>
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-sm text-muted-foreground">{stat.suffix}</span>
              )}
            </div>
            {stat.isPositive === null && (
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            )}
          </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
