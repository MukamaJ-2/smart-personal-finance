import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  LineChart,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const monthlyData = [
  { month: "Jan", income: 280000, expenses: 125000, savings: 155000 },
  { month: "Feb", income: 280000, expenses: 132000, savings: 148000 },
  { month: "Mar", income: 320000, expenses: 145000, savings: 175000 },
  { month: "Apr", income: 280000, expenses: 128000, savings: 152000 },
  { month: "May", income: 280000, expenses: 138000, savings: 142000 },
  { month: "Jun", income: 350000, expenses: 150000, savings: 200000 },
];

const categoryData = [
  { name: "Essentials", value: 45000, color: "#22c55e" },
  { name: "Entertainment", value: 12500, color: "#f59e0b" },
  { name: "Dining", value: 9800, color: "#ef4444" },
  { name: "Transport", value: 3200, color: "#3b82f6" },
  { name: "Shopping", value: 5500, color: "#a855f7" },
  { name: "Health", value: 2500, color: "#ec4899" },
];

const weeklyData = [
  { day: "Mon", amount: 3200 },
  { day: "Tue", amount: 4500 },
  { day: "Wed", amount: 2800 },
  { day: "Thu", amount: 5200 },
  { day: "Fri", amount: 3800 },
  { day: "Sat", amount: 6800 },
  { day: "Sun", amount: 4200 },
];

const insights = [
  {
    title: "Spending Trend",
    value: "+12%",
    change: "vs last month",
    isPositive: false,
    icon: TrendingUp,
    color: "text-destructive",
  },
  {
    title: "Savings Rate",
    value: "28%",
    change: "of income",
    isPositive: true,
    icon: TrendingUp,
    color: "text-success",
  },
  {
    title: "Top Category",
    value: "Essentials",
    change: "USh 45,000 spent",
    isPositive: null,
    icon: DollarSign,
    color: "text-primary",
  },
  {
    title: "Avg Daily Spend",
    value: "USh 4,200",
    change: "this week",
    isPositive: null,
    icon: Calendar,
    color: "text-accent",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [showFilters, setShowFilters] = useState(false);

  const monthlyWindow =
    timeRange === "year"
      ? monthlyData
      : timeRange === "month"
        ? monthlyData.slice(-3)
        : monthlyData.slice(-1);

  const totalIncome = monthlyWindow.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = monthlyWindow.reduce((sum, d) => sum + d.expenses, 0);
  const totalSavings = monthlyWindow.reduce((sum, d) => sum + d.savings, 0);

  const exportReport = () => {
    const rows: string[][] = [];
    rows.push([`Report Export (${timeRange})`]);
    rows.push([]);
    rows.push(["Monthly Summary"]);
    rows.push(["Month", "Income", "Expenses", "Savings"]);
    monthlyWindow.forEach((row) => {
      rows.push([row.month, row.income.toString(), row.expenses.toString(), row.savings.toString()]);
    });
    rows.push([]);
    rows.push(["Weekly Spending"]);
    rows.push(["Day", "Amount"]);
    weeklyData.forEach((row) => {
      rows.push([row.day, row.amount.toString()]);
    });
    rows.push([]);
    rows.push(["Category Distribution"]);
    rows.push(["Category", "Amount"]);
    categoryData.forEach((row) => {
      rows.push([row.name, row.value.toString()]);
    });

    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uniguard-wallet-report-${timeRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Your CSV report has been downloaded.",
    });
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
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              Financial Reports
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Comprehensive analytics and insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="border-border hover:border-primary/50"
              onClick={() => {
                setShowFilters(true);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => {
                exportReport();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 hover:glass-card-glow transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className={cn("w-4 h-4", insight.color)} />
                  </div>
                  {insight.isPositive !== null && (
                    <div className={cn("flex items-center gap-1 text-xs", insight.color)}>
                      {insight.isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {insight.title}
                </p>
                <p className={cn("font-mono text-2xl font-bold mb-1", insight.color)}>
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground">{insight.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Income vs Expenses Line Chart */}
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  Income vs Expenses Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={monthlyWindow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--success))", r: 4 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                      name="Expenses"
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      name="Savings"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Spending Bar Chart */}
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Spending Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-success">
                    {formatCurrency(totalIncome)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Selected range</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Average Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-foreground">
                    {formatCurrency(totalIncome / monthlyData.length)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Average</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-success">+12.5%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-destructive">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Selected range</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Average Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-foreground">
                    {formatCurrency(totalExpenses / monthlyData.length)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Average</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Change</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-2xl font-bold text-destructive">+8.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Expense Distribution by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {categoryData.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {formatCurrency(category.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle>Filter Reports</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "year")}
                  className="w-full px-3 py-2 bg-muted/30 rounded-lg text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowFilters(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

