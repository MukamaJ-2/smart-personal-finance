import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  Target,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Nexus Hub", path: "/" },
  { icon: Wallet, label: "Transactions", path: "/transactions" },
  { icon: Zap, label: "Flux Pods", path: "/flux-pods" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: MessageSquare, label: "AI Companion", path: "/companion" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Trophy, label: "Achievements", path: "/achievements" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      navigate("/auth");
    }, 500);
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen flex flex-col bg-sidebar border-r border-sidebar-border relative"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-display text-lg font-bold text-foreground">FinNexus</span>
              <span className="text-[10px] text-primary font-mono uppercase tracking-wider">AI Finance</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-glow-sm"
                  />
                )}
                
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isActive && "text-glow-sm"
                )} />
                
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Health Score */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mb-4 p-4 glass-card rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Health Score</span>
            <span className="font-mono text-lg font-bold text-success text-glow-sm">87</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-success rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Excellent financial health</p>
        </motion.div>
      )}

      {/* Logout Button */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
        <motion.button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
            "text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center"
          )}
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              Logout
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar-accent border border-sidebar-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
