import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, Target, Wallet, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import FinancialNexus from "@/components/nexus/FinancialNexus";
import AppLayout from "@/components/layout/AppLayout";
import QuickStats from "@/components/dashboard/QuickStats";
import FluxPodPreview from "@/components/dashboard/FluxPodPreview";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
            <h1 className="font-display text-2xl font-bold text-foreground">
              Nexus Hub
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your financial command center
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-border hover:border-primary/50"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
              <Activity className="w-4 h-4 text-success animate-pulse" />
              <span className="text-sm font-mono text-foreground">System Online</span>
            </div>
          </div>
        </motion.header>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 3D Nexus Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 glass-card rounded-2xl overflow-hidden relative scan-line"
          >
            <div className="absolute top-4 left-4 z-10">
              <h2 className="font-display text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                Financial Nexus
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Interactive 3D visualization</p>
            </div>
            <div className="h-[500px]">
              <FinancialNexus />
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Flux Pods Preview */}
            <FluxPodPreview />

            {/* Recent Activity */}
            <RecentTransactions />

            {/* Notifications */}
            <NotificationsPanel />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
