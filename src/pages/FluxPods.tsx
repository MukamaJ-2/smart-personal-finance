import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  ArrowRightLeft,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aiService } from "@/lib/ai/ai-service";
import type { TrainingTransaction } from "@/lib/ai/training-data";
import { Badge } from "@/components/ui/badge";

interface FluxPod {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  status: "healthy" | "warning" | "critical";
  velocity: number; // days until depleted at current rate
  children?: FluxPod[];
}

const initialFluxPods: FluxPod[] = [
  {
    id: "1",
    name: "Essentials",
    allocated: 80000,
    spent: 45000,
    status: "healthy",
    velocity: 18,
    children: [
      { id: "1a", name: "Groceries", allocated: 25000, spent: 12000, status: "healthy", velocity: 22 },
      { id: "1b", name: "Utilities", allocated: 15000, spent: 8000, status: "healthy", velocity: 25 },
      { id: "1c", name: "Housing", allocated: 40000, spent: 25000, status: "healthy", velocity: 15 },
    ],
  },
  {
    id: "2",
    name: "Entertainment",
    allocated: 15000,
    spent: 12500,
    status: "warning",
    velocity: 4,
    children: [
      { id: "2a", name: "Streaming", allocated: 2000, spent: 1500, status: "healthy", velocity: 10 },
      { id: "2b", name: "Games", allocated: 3000, spent: 2800, status: "critical", velocity: 2 },
      { id: "2c", name: "Events", allocated: 10000, spent: 8200, status: "warning", velocity: 5 },
    ],
  },
  {
    id: "3",
    name: "Dining Out",
    allocated: 10000,
    spent: 9800,
    status: "critical",
    velocity: 1,
  },
  {
    id: "4",
    name: "Transport",
    allocated: 8000,
    spent: 3200,
    status: "healthy",
    velocity: 30,
  },
  {
    id: "5",
    name: "Shopping",
    allocated: 12000,
    spent: 5500,
    status: "healthy",
    velocity: 14,
  },
  {
    id: "6",
    name: "Health & Fitness",
    allocated: 5000,
    spent: 2500,
    status: "healthy",
    velocity: 20,
  },
];

const statusConfig = {
  healthy: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    gradient: "from-success to-success-glow",
    icon: CheckCircle,
    label: "Healthy",
  },
  warning: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    gradient: "from-warning to-accent-glow",
    icon: AlertTriangle,
    label: "Strained",
  },
  critical: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    gradient: "from-destructive to-destructive-glow",
    icon: AlertTriangle,
    label: "Critical",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ReallocateDialog({ 
  pod, 
  allPods, 
  open, 
  onOpenChange, 
  onReallocate 
}: { 
  pod: FluxPod; 
  allPods: FluxPod[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReallocate: (fromPodId: string, toPodId: string, amount: number) => void;
}) {
  const [targetPodId, setTargetPodId] = useState("");
  const [amount, setAmount] = useState("");
  const availablePods = allPods.filter((p) => p.id !== pod.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPodId || !amount) return;

    const reallocateAmount = parseFloat(amount) || 0;
    if (reallocateAmount <= 0 || reallocateAmount > (pod.allocated - pod.spent)) {
      toast({
        title: "Invalid amount",
        description: "Amount must be greater than 0 and not exceed available balance.",
        variant: "destructive",
      });
      return;
    }

    onReallocate(pod.id, targetPodId, reallocateAmount);
    setTargetPodId("");
    setAmount("");
    onOpenChange(false);
    toast({
      title: "Funds reallocated",
      description: `${formatCurrency(reallocateAmount)} moved from "${pod.name}" successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle>Reallocate Funds from {pod.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="target-pod">Move to Pod</Label>
            <select
              id="target-pod"
              value={targetPodId}
              onChange={(e) => setTargetPodId(e.target.value)}
              className="w-full px-3 py-2 bg-muted/30 rounded-lg text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
              required
            >
              <option value="">Select a pod...</option>
              {availablePods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Available: {formatCurrency(p.allocated - p.spent)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="reallocate-amount">Amount (UGX)</Label>
            <Input
              id="reallocate-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: ${formatCurrency(pod.allocated - pod.spent)}`}
              className="bg-muted/30 border-border mt-1"
              required
              min="0"
              max={pod.allocated - pod.spent}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: {formatCurrency(pod.allocated - pod.spent)}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Reallocate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfigureDialog({
  pod,
  open,
  onOpenChange,
  onUpdate,
}: {
  pod: FluxPod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (podId: string, updates: Partial<FluxPod>) => void;
}) {
  const [name, setName] = useState(pod.name);
  const [allocated, setAllocated] = useState(pod.allocated.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !allocated) return;

    const newAllocated = parseFloat(allocated) || 0;
    if (newAllocated < pod.spent) {
      toast({
        title: "Invalid budget",
        description: "Budget cannot be less than amount already spent.",
        variant: "destructive",
      });
      return;
    }

    onUpdate(pod.id, {
      name,
      allocated: newAllocated,
    });
    onOpenChange(false);
    toast({
      title: "Pod updated",
      description: `"${name}" has been updated successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle>Configure {pod.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pod-name">Pod Name</Label>
            <Input
              id="pod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/30 border-border mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="pod-allocated">Allocated Budget (UGX)</Label>
            <Input
              id="pod-allocated"
              type="number"
              value={allocated}
              onChange={(e) => setAllocated(e.target.value)}
              className="bg-muted/30 border-border mt-1"
              required
              min={pod.spent}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current spent: {formatCurrency(pod.spent)}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PodCard({ 
  pod, 
  index, 
  allPods,
  onUpdate,
  onReallocate 
}: { 
  pod: FluxPod; 
  index: number;
  allPods: FluxPod[];
  onUpdate: (podId: string, updates: Partial<FluxPod>) => void;
  onReallocate: (fromPodId: string, toPodId: string, amount: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showReallocate, setShowReallocate] = useState(false);
  const [showConfigure, setShowConfigure] = useState(false);
  const config = statusConfig[pod.status];
  const percentage = (pod.spent / pod.allocated) * 100;
  const remaining = pod.allocated - pod.spent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all duration-500",
        pod.status === "healthy" && "breathing",
        pod.status === "warning" && "breathing-fast",
        pod.status === "critical" && "pulse-glow"
      )}
    >
      {/* Header */}
      <div
        className={cn("p-5 border-b", config.border)}
        onClick={() => pod.children && setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl border", config.bg, config.border)}>
              <Zap className={cn("w-5 h-5", config.color)} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{pod.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <config.icon className={cn("w-3 h-3", config.color)} />
                <span className={cn("text-xs", config.color)}>{config.label}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xl font-bold text-foreground">
              {formatCurrency(remaining)}
            </p>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", config.gradient)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          {percentage > 100 && (
            <motion.div
              className="absolute inset-y-0 right-0 bg-destructive/50"
              initial={{ width: 0 }}
              animate={{ width: `${percentage - 100}%` }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground">{formatCurrency(pod.spent)}</span> spent
            </span>
            <span className="text-muted-foreground">
              of <span className="font-mono text-foreground">{formatCurrency(pod.allocated)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className={cn("w-4 h-4", config.color)} />
            <span className={cn("font-mono text-sm", config.color)}>
              {pod.velocity}d left
            </span>
            <Badge variant="outline" className="text-xs px-1.5 py-0 border-primary/30 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </Badge>
          </div>
        </div>

        {/* Expand indicator */}
        {pod.children && (
          <div className="flex justify-center mt-3">
            <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Children */}
      {pod.children && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border"
        >
          {pod.children.map((child) => {
            const childConfig = statusConfig[child.status];
            const childPercentage = (child.spent / child.allocated) * 100;
            return (
              <div
                key={child.id}
                className="p-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", childConfig.bg, childConfig.color)} />
                    <span className="text-sm font-medium text-foreground">{child.name}</span>
                  </div>
                  <span className={cn("text-xs font-mono", childConfig.color)}>
                    {childPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", childConfig.gradient)}
                    style={{ width: `${Math.min(childPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                  <span>{formatCurrency(child.spent)}</span>
                  <span>{formatCurrency(child.allocated - child.spent)} left</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 p-3 bg-muted/20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 text-muted-foreground hover:text-foreground"
          onClick={() => setShowReallocate(true)}
          disabled={remaining <= 0 || allPods.length <= 1}
        >
          <ArrowRightLeft className="w-4 h-4 mr-1" />
          Reallocate
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 text-muted-foreground hover:text-foreground"
          onClick={() => setShowConfigure(true)}
        >
          <Settings className="w-4 h-4 mr-1" />
          Configure
        </Button>
      </div>

      {/* Dialogs */}
      <ReallocateDialog
        pod={pod}
        allPods={allPods}
        open={showReallocate}
        onOpenChange={setShowReallocate}
        onReallocate={onReallocate}
      />
      <ConfigureDialog
        pod={pod}
        open={showConfigure}
        onOpenChange={setShowConfigure}
        onUpdate={onUpdate}
      />
    </motion.div>
  );
}

function NewPodDialog({ onAdd, existingPods }: { onAdd: (pod: FluxPod) => void; existingPods: FluxPod[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{ amount: number; reasoning: string } | null>(null);

  // Get AI suggestion when name changes
  useEffect(() => {
    if (name && name.length > 2) {
      const suggestion = aiService.suggestNewPodAllocation(
        name,
        100000, // Available budget placeholder
        existingPods.map((p) => ({ name: p.name, allocated: p.allocated }))
      );
      
      if (suggestion) {
        setAiSuggestion({
          amount: suggestion.suggestedAmount,
          reasoning: suggestion.reasoning,
        });
        // Auto-fill if empty
        if (!allocated) {
          setAllocated(suggestion.suggestedAmount.toString());
        }
      }
    } else {
      setAiSuggestion(null);
    }
  }, [name, existingPods]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !allocated) return;

    const newPod: FluxPod = {
      id: Date.now().toString(),
      name,
      allocated: parseFloat(allocated) || 0,
      spent: 0,
      status: "healthy",
      velocity: 30,
    };

    onAdd(newPod);
    setName("");
    setAllocated("");
    setAiSuggestion(null);
    setOpen(false);
    toast({
      title: "Flux Pod created",
      description: `"${name}" has been created with a budget of ${formatCurrency(newPod.allocated)}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          New Pod
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Flux Pod</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pod Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Entertainment, Dining"
              className="bg-muted/30 border-border mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="allocated">Allocated Budget (UGX)</Label>
            <Input
              id="allocated"
              type="number"
              value={allocated}
              onChange={(e) => setAllocated(e.target.value)}
              placeholder="100000"
              className="bg-muted/30 border-border mt-1"
              required
              min="0"
            />
            {aiSuggestion && (
              <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/30">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Suggestion</span>
                </div>
                <p className="text-sm text-foreground mb-2">{aiSuggestion.reasoning}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setAllocated(aiSuggestion.amount.toString())}
                >
                  Use Suggested: {formatCurrency(aiSuggestion.amount)}
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Create Pod
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FluxPods() {
  const [fluxPods, setFluxPods] = useState<FluxPod[]>(initialFluxPods);
  const [forecasts, setForecasts] = useState<Record<string, { daysLeft: number; trend: string }>>({});

  // Initialize AI service
  useEffect(() => {
    // Convert pods to training transactions (simulated)
    const trainingData: TrainingTransaction[] = fluxPods.flatMap((pod) => [
      {
        description: `${pod.name} spending`,
        amount: pod.spent,
        category: pod.name,
        type: "expense" as const,
        date: new Date().toISOString(),
      },
    ]);
    
    aiService.initialize(trainingData, 280000);
    
    // Generate forecasts for each pod
    const forecastMap: Record<string, { daysLeft: number; trend: string }> = {};
    fluxPods.forEach((pod) => {
      const forecast = aiService.forecastSpending(pod.name, pod.allocated, pod.spent, 30);
      forecastMap[pod.id] = {
        daysLeft: forecast.daysUntilDepletion,
        trend: forecast.trend,
      };
    });
    setForecasts(forecastMap);
  }, [fluxPods]);

  const handleAddPod = (pod: FluxPod) => {
    setFluxPods((prev) => [...prev, pod]);
  };

  const handleUpdatePod = (podId: string, updates: Partial<FluxPod>) => {
    setFluxPods((prev) =>
      prev.map((pod) => {
        if (pod.id === podId) {
          return { ...pod, ...updates };
        }
        // Also update children if parent is updated
        if (pod.children) {
          return {
            ...pod,
            children: pod.children.map((child) =>
              child.id === podId ? { ...child, ...updates } : child
            ),
          };
        }
        return pod;
      })
    );
  };

  const handleReallocate = (fromPodId: string, toPodId: string, amount: number) => {
    setFluxPods((prev) =>
      prev.map((pod) => {
        if (pod.id === fromPodId) {
          // Reduce allocated amount from source pod
          return {
            ...pod,
            allocated: pod.allocated - amount,
          };
        }
        if (pod.id === toPodId) {
          // Increase allocated amount in target pod
          return {
            ...pod,
            allocated: pod.allocated + amount,
          };
        }
        // Check children
        if (pod.children) {
          return {
            ...pod,
            children: pod.children.map((child) => {
              if (child.id === fromPodId) {
                return { ...child, allocated: child.allocated - amount };
              }
              if (child.id === toPodId) {
                return { ...child, allocated: child.allocated + amount };
              }
              return child;
            }),
          };
        }
        return pod;
      })
    );
  };

  const totalAllocated = fluxPods.reduce((sum, pod) => sum + pod.allocated, 0);
  const totalSpent = fluxPods.reduce((sum, pod) => sum + pod.spent, 0);
  const healthyCount = fluxPods.filter((p) => p.status === "healthy").length;
  const warningCount = fluxPods.filter((p) => p.status === "warning").length;
  const criticalCount = fluxPods.filter((p) => p.status === "critical").length;

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
            <h1 className="font-display text-2xl font-bold text-foreground">Flux Pods</h1>
            <p className="text-muted-foreground text-sm mt-1">Living budget containers</p>
          </div>
          <NewPodDialog onAdd={handleAddPod} existingPods={fluxPods} />
        </motion.header>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4"
        >
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Allocated</p>
            <p className="font-mono text-xl font-bold text-foreground">{formatCurrency(totalAllocated)}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Spent</p>
            <p className="font-mono text-xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pod Health</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-success font-mono">{healthyCount} ✓</span>
              <span className="text-warning font-mono">{warningCount} ⚠</span>
              <span className="text-destructive font-mono">{criticalCount} ✗</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remaining</p>
            <p className="font-mono text-xl font-bold text-success">{formatCurrency(totalAllocated - totalSpent)}</p>
          </div>
        </motion.div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {fluxPods.map((pod, index) => (
            <PodCard 
              key={pod.id} 
              pod={pod} 
              index={index}
              allPods={fluxPods}
              onUpdate={handleUpdatePod}
              onReallocate={handleReallocate}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
