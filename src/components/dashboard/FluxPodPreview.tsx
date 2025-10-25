import { motion } from "framer-motion";
import { Zap, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FluxPod {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  status: "healthy" | "warning" | "critical";
}

const pods: FluxPod[] = [
  { id: "1", name: "Essentials", allocated: 80000, spent: 45000, status: "healthy" },
  { id: "2", name: "Entertainment", allocated: 15000, spent: 12500, status: "warning" },
  { id: "3", name: "Dining Out", allocated: 10000, spent: 9800, status: "critical" },
  { id: "4", name: "Transport", allocated: 8000, spent: 3200, status: "healthy" },
];

const statusConfig = {
  healthy: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: CheckCircle,
    animation: "breathing",
  },
  warning: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: AlertTriangle,
    animation: "breathing-fast",
  },
  critical: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: AlertTriangle,
    animation: "pulse-glow",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FluxPodPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 shadow-glow-sm">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-display text-sm font-semibold text-foreground">Flux Pods</h3>
        </div>
        <Link 
          to="/flux-pods"
          className="text-xs text-primary hover:text-primary-glow transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {pods.map((pod) => {
          const config = statusConfig[pod.status];
          const percentage = (pod.spent / pod.allocated) * 100;
          const remaining = pod.allocated - pod.spent;

          return (
            <Link key={pod.id} to="/flux-pods">
            <motion.div
              className={cn(
                  "p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                config.bg,
                config.border,
                config.animation
              )}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <config.icon className={cn("w-3.5 h-3.5", config.color)} />
                  <span className="text-sm font-medium text-foreground">{pod.name}</span>
                </div>
                <span className={cn("text-xs font-mono", config.color)}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    pod.status === "healthy" && "bg-gradient-success",
                    pod.status === "warning" && "bg-gradient-warm",
                    pod.status === "critical" && "bg-gradient-danger"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatCurrency(pod.spent)} spent
                </span>
                <span className={cn("font-mono", remaining > 0 ? "text-success" : "text-destructive")}>
                  {formatCurrency(remaining)} left
                </span>
              </div>
            </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
