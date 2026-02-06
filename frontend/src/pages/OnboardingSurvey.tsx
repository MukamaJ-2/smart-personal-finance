import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const LIFE_STAGES = [
  { value: "student", label: "Student" },
  { value: "young_professional", label: "Young professional, no dependents" },
  { value: "supporting_family", label: "Supporting family" },
  { value: "pre_retirement", label: "Pre-retirement" },
  { value: "retired", label: "Retired" },
  { value: "custom", label: "Something else — I'll write below" },
];

const INCOME_PATTERNS = [
  { value: "fixed", label: "Fixed monthly salary" },
  { value: "variable", label: "Variable (freelance, commissions)" },
  { value: "irregular", label: "Irregular" },
  { value: "student_low", label: "Student or low income" },
  { value: "custom", label: "Something else — I'll write below" },
];

const CATEGORIES = [
  "Housing / Rent",
  "Utilities",
  "Groceries & Food",
  "Transport",
  "Healthcare",
  "Education",
  "Insurance",
  "Debt repayments",
  "Savings / Investments",
  "Childcare",
  "Eating Out",
  "Shopping",
  "Entertainment",
  "Personal Care",
  "Gifts / Donations",
  "Travel",
  "Tech / Subscriptions",
  "Miscellaneous",
];

const PLANNED_EXPENSES = [
  { value: "none", label: "None" },
  { value: "wedding_event", label: "Wedding or event" },
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "home_car", label: "Home or car" },
  { value: "custom", label: "Something else — I'll write below" },
];

const SAVINGS_GOALS = [
  { value: "none", label: "No specific goal" },
  { value: "emergency", label: "Emergency fund" },
  { value: "big_purchase", label: "Big purchase (e.g. car, home)" },
  { value: "retirement", label: "Retirement" },
  { value: "pay_debt", label: "Paying off debt" },
  { value: "custom", label: "Something else — I'll write below" },
];

const CUT_BACK_OPTIONS = [
  "Eating Out",
  "Shopping",
  "Entertainment",
  "Travel",
  "Tech / Subscriptions",
  "Personal Care",
];

const BUDGET_MIND = [
  { value: "yes_clear", label: "Yes, I have clear amounts" },
  { value: "rough", label: "I have rough ranges" },
  { value: "no_suggest", label: "No, I want the app to suggest" },
];

const ALERT_PREFERENCE = [
  { value: "strict", label: "Alert me strictly when I go over my set limits" },
  { value: "big_only", label: "Only warn on big overruns" },
  { value: "use_profile", label: "Use my answers to decide what's normal for me; rarely warn" },
  { value: "inform_only", label: "Just inform me, don't warn" },
];

export interface OnboardingAnswers {
  lifeStage?: string;
  lifeStageCustom?: string;
  dependants?: string;
  incomePattern?: string;
  incomePatternCustom?: string;
  essentialCategories?: string[];
  topSpendingCategories?: string[];
  plannedExpenses?: string;
  plannedExpensesCustom?: string;
  savingsGoal?: string;
  savingsGoalCustom?: string;
  willingToCutBack?: string[];
  budgetInMind?: string;
  expectedAmounts?: Record<string, number>;
  alertPreference?: string;
}

const TOTAL_STEPS = 4;

const STEP_TITLES = [
  "About You",
  "Spending Priorities",
  "Goals & Flexibility",
  "Budget & Preferences",
];

export default function OnboardingSurvey() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [lifeStage, setLifeStage] = useState("");
  const [lifeStageCustom, setLifeStageCustom] = useState("");
  const [dependants, setDependants] = useState("");
  const [incomePattern, setIncomePattern] = useState("");
  const [incomePatternCustom, setIncomePatternCustom] = useState("");
  const [essentialCategories, setEssentialCategories] = useState<string[]>([]);
  const [topSpendingCategories, setTopSpendingCategories] = useState<string[]>([]);
  const [plannedExpenses, setPlannedExpenses] = useState("");
  const [plannedExpensesCustom, setPlannedExpensesCustom] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [savingsGoalCustom, setSavingsGoalCustom] = useState("");
  const [willingToCutBack, setWillingToCutBack] = useState<string[]>([]);
  const [willingToCutBackWriteIn, setWillingToCutBackWriteIn] = useState("");
  const [budgetInMind, setBudgetInMind] = useState("");
  const [expectedAmounts, setExpectedAmounts] = useState<Record<string, number>>({});
  const [alertPreference, setAlertPreference] = useState("");

  useEffect(() => {
    let isActive = true;
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!isActive) return;
      if (error || !user) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserId(user.id);
      if (!isEditMode) {
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_answers")
        .eq("id", user.id)
        .maybeSingle();
      if (!isActive) return;
      const answers = (profile as { onboarding_answers?: OnboardingAnswers } | null)?.onboarding_answers;
      if (answers) {
        setLifeStage(answers.lifeStage ?? "");
        setLifeStageCustom(answers.lifeStageCustom ?? "");
        setDependants(answers.dependants ?? "");
        setIncomePattern(answers.incomePattern ?? "");
        setIncomePatternCustom(answers.incomePatternCustom ?? "");
        setEssentialCategories(answers.essentialCategories ?? []);
        setTopSpendingCategories(answers.topSpendingCategories ?? []);
        setPlannedExpenses(answers.plannedExpenses ?? "");
        setPlannedExpensesCustom(answers.plannedExpensesCustom ?? "");
        setSavingsGoal(answers.savingsGoal ?? "");
        setSavingsGoalCustom(answers.savingsGoalCustom ?? "");
        setWillingToCutBack(answers.willingToCutBack ?? []);
        setBudgetInMind(answers.budgetInMind ?? "");
        setExpectedAmounts(answers.expectedAmounts ?? {});
        setAlertPreference(answers.alertPreference ?? "");
      }
      setLoading(false);
    })();
    return () => {
      isActive = false;
    };
  }, [navigate, isEditMode]);

  const toggleEssential = (cat: string) => {
    setEssentialCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleTopSpending = (cat: string) => {
    setTopSpendingCategories((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= 3) return prev;
      return [...prev, cat];
    });
  };

  const toggleWillingToCutBack = (cat: string) => {
    setWillingToCutBack((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= 2) return prev;
      return [...prev, cat];
    });
  };

  const addWillingToCutBackWriteIn = () => {
    const trimmed = willingToCutBackWriteIn.trim();
    if (!trimmed) return;
    if (willingToCutBack.includes(trimmed)) return;
    if (willingToCutBack.length >= 2) return;
    setWillingToCutBack((prev) => [...prev, trimmed]);
    setWillingToCutBackWriteIn("");
  };

  const removeWillingToCutBack = (cat: string) => {
    setWillingToCutBack((prev) => prev.filter((c) => c !== cat));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!lifeStage || !dependants || !incomePattern) return false;
        if (lifeStage === "custom" && !lifeStageCustom.trim()) return false;
        if (incomePattern === "custom" && !incomePatternCustom.trim()) return false;
        return true;
      case 2:
        return essentialCategories.length > 0;
      case 3:
        return true; // All optional
      case 4:
        return true; // All optional except maybe alert preference
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Complete required fields",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    // Only allow submit when on the last step (prevents Enter key or accidental submit from redirecting early)
    if (currentStep !== TOTAL_STEPS) {
      return;
    }
    if (!validateStep(1) || !validateStep(2)) {
      toast({
        title: "Complete required fields",
        description: "Please complete all required steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const answers: OnboardingAnswers = {
      lifeStage: lifeStage === "custom" ? undefined : lifeStage,
      lifeStageCustom: lifeStage === "custom" ? lifeStageCustom : undefined,
      dependants,
      incomePattern: incomePattern === "custom" ? undefined : incomePattern,
      incomePatternCustom: incomePattern === "custom" ? incomePatternCustom : undefined,
      essentialCategories,
      topSpendingCategories: topSpendingCategories.length ? topSpendingCategories : undefined,
      plannedExpenses: plannedExpenses === "custom" ? undefined : plannedExpenses,
      plannedExpensesCustom: plannedExpenses === "custom" ? plannedExpensesCustom : undefined,
      savingsGoal: savingsGoal === "custom" ? undefined : savingsGoal,
      savingsGoalCustom: savingsGoal === "custom" ? savingsGoalCustom : undefined,
      willingToCutBack: willingToCutBack.length ? willingToCutBack : undefined,
      budgetInMind: budgetInMind || undefined,
      expectedAmounts: Object.keys(expectedAmounts).length ? expectedAmounts : undefined,
      alertPreference: alertPreference || undefined,
    };

    const completedAt = new Date().toISOString();
    const { data: updatedRows, error } = await supabase
      .from("profiles")
      .update({
        onboarding_answers: answers,
        onboarding_completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq("id", userId)
      .select("id");

    if (error) {
      setSubmitting(false);
      toast({
        title: "Could not save",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    // If no row was updated (e.g. profile row missing), insert so completion is persisted
    if (!updatedRows?.length) {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        name: (user?.user_metadata?.name as string) ?? (user?.user_metadata?.full_name as string) ?? null,
        email: (user?.email as string) ?? null,
        onboarding_answers: answers,
        onboarding_completed_at: completedAt,
        updated_at: completedAt,
      });
      if (insertError) {
        setSubmitting(false);
        toast({
          title: "Could not save",
          description: insertError.message,
          variant: "destructive",
        });
        return;
      }
    }

    setSubmitting(false);
    toast({
      title: "Profile saved",
      description: isEditMode ? "Your preferences have been updated." : "Your preferences will personalize budgets and alerts.",
    });
    if (!isEditMode) {
      try {
        sessionStorage.setItem("onboarding_just_completed", "1");
      } catch {}
    }
    navigate("/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow-md mb-4">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {isEditMode ? "Adjust your preferences" : "Tell us about you"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            A few questions so we can personalize your budget and avoid unnecessary “overspend” warnings.
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-xs font-medium text-foreground">
                {STEP_TITLES[currentStep - 1]}
              </span>
            </div>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div
                  key={stepNum}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep !== TOTAL_STEPS) e.preventDefault();
          }}
          className="space-y-6"
        >
          {/* Step 1: About You */}
          {currentStep === 1 && (
            <>
              {/* 1. Life stage */}
              <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">1. Life stage</h2>
            <p className="text-xs text-muted-foreground mb-3">What best describes you?</p>
            <Select value={lifeStage} onValueChange={setLifeStage} required>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {LIFE_STAGES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lifeStage === "custom" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">Please specify</Label>
                <Input
                  placeholder="e.g. Self-employed, caregiver..."
                  className="mt-1 bg-muted/30 border-border"
                  value={lifeStageCustom}
                  onChange={(e) => setLifeStageCustom(e.target.value)}
                />
              </div>
            )}
          </section>

          {/* 2. Dependants */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">2. Dependants</h2>
            <p className="text-xs text-muted-foreground mb-3">How many people depend on your income (including you)?</p>
            <Select value={dependants} onValueChange={setDependants} required>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4", "5+"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* 3. Income pattern */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">3. Income pattern</h2>
            <p className="text-xs text-muted-foreground mb-3">How would you describe your income?</p>
            <Select value={incomePattern} onValueChange={setIncomePattern} required>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {INCOME_PATTERNS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {incomePattern === "custom" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">Please specify</Label>
                <Input
                  placeholder="e.g. Seasonal work, investments..."
                  className="mt-1 bg-muted/30 border-border"
                  value={incomePatternCustom}
                  onChange={(e) => setIncomePatternCustom(e.target.value)}
                />
              </div>
            )}
          </section>
            </>
          )}

          {/* Step 2: Spending Priorities */}
          {currentStep === 2 && (
            <>
              {/* 4. Essential categories */}
              <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">4. Essential spending</h2>
            <p className="text-xs text-muted-foreground mb-3">Which of these are essential for you? (Select all that apply)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted/30"
                >
                  <Checkbox
                    checked={essentialCategories.includes(cat)}
                    onCheckedChange={() => toggleEssential(cat)}
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 5. Top spending categories */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">5. Where you spend most</h2>
            <p className="text-xs text-muted-foreground mb-3">Pick up to 3 categories you expect to spend the most on each month.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted/30"
                >
                  <Checkbox
                    checked={topSpendingCategories.includes(cat)}
                    onCheckedChange={() => toggleTopSpending(cat)}
                    disabled={!topSpendingCategories.includes(cat) && topSpendingCategories.length >= 3}
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </section>
            </>
          )}

          {/* Step 3: Goals & Flexibility */}
          {currentStep === 3 && (
            <>
              {/* 6. Planned expenses */}
              <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">6. Big planned expenses (optional)</h2>
            <p className="text-xs text-muted-foreground mb-3">Any big expenses in the next 12 months?</p>
            <Select value={plannedExpenses} onValueChange={setPlannedExpenses}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select if any..." />
              </SelectTrigger>
              <SelectContent>
                {PLANNED_EXPENSES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {plannedExpenses === "custom" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">Please specify</Label>
                <Input
                  placeholder="e.g. New laptop, family trip..."
                  className="mt-1 bg-muted/30 border-border"
                  value={plannedExpensesCustom}
                  onChange={(e) => setPlannedExpensesCustom(e.target.value)}
                />
              </div>
            )}
          </section>

          {/* 7. Savings goal */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">7. Savings goal</h2>
            <p className="text-xs text-muted-foreground mb-3">What’s your main savings goal right now?</p>
            <Select value={savingsGoal} onValueChange={setSavingsGoal}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {SAVINGS_GOALS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {savingsGoal === "custom" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">Please specify</Label>
                <Input
                  placeholder="e.g. Wedding fund, side business..."
                  className="mt-1 bg-muted/30 border-border"
                  value={savingsGoalCustom}
                  onChange={(e) => setSavingsGoalCustom(e.target.value)}
                />
              </div>
            )}
          </section>

          {/* 8. Willing to cut back */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">8. Where you’d cut back</h2>
            <p className="text-xs text-muted-foreground mb-3">Pick up to 2 categories you’re most willing to reduce if needed.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CUT_BACK_OPTIONS.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted/30"
                >
                  <Checkbox
                    checked={willingToCutBack.includes(cat)}
                    onCheckedChange={() => toggleWillingToCutBack(cat)}
                    disabled={!willingToCutBack.includes(cat) && willingToCutBack.length >= 2}
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 mb-2">If none of these fit, write your own (e.g. category name):</p>
            <div className="flex gap-2">
              <Input
                placeholder="Type and press Add"
                className="bg-muted/30 border-border flex-1"
                value={willingToCutBackWriteIn}
                onChange={(e) => setWillingToCutBackWriteIn(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addWillingToCutBackWriteIn())}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWillingToCutBackWriteIn}
                disabled={!willingToCutBackWriteIn.trim() || willingToCutBack.length >= 2}
              >
                Add
              </Button>
            </div>
            {willingToCutBack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {willingToCutBack.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-sm"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeWillingToCutBack(cat)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                      aria-label={`Remove ${cat}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>
            </>
          )}

          {/* Step 4: Budget & Preferences */}
          {currentStep === 4 && (
            <>
              {/* 9. Budget in mind */}
              <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">9. Budget expectations</h2>
            <p className="text-xs text-muted-foreground mb-3">Do you already have a monthly budget in mind for your main categories?</p>
            <Select value={budgetInMind} onValueChange={setBudgetInMind}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_MIND.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* 10. Optional amounts */}
          {(budgetInMind === "yes_clear" || budgetInMind === "rough") && topSpendingCategories.length > 0 && (
            <section className="glass-card rounded-xl p-6 border border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">10. Expected monthly amounts (optional)</h2>
              <p className="text-xs text-muted-foreground mb-3">Rough monthly amount (e.g. in UGX) for your top categories.</p>
              <div className="space-y-3">
                {topSpendingCategories.slice(0, 3).map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <Label className="text-sm w-40 shrink-0">{cat}</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Amount"
                      className="bg-muted/30 border-border"
                      value={expectedAmounts[cat] !== undefined ? String(expectedAmounts[cat]) : ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const v = raw === "" ? undefined : Number(raw);
                        setExpectedAmounts((prev) => {
                          const next = { ...prev };
                          if (v != null && !Number.isNaN(v) && v > 0) next[cat] = v;
                          else delete next[cat];
                          return next;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 11. Alert preference */}
          <section className="glass-card rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">11. How to treat “over budget”</h2>
            <p className="text-xs text-muted-foreground mb-3">How should we treat overspending alerts?</p>
            <Select value={alertPreference} onValueChange={setAlertPreference}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {ALERT_PREFERENCE.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
              >
                {submitting ? "Saving..." : isEditMode ? "Save and go to dashboard" : "Finish and go to dashboard"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
