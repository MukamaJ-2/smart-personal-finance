# Onboarding survey – specification

This document defines an **optional onboarding survey** for UniGuard Wallet. The survey builds a **user profile** so the system can treat spending as “normal” within the user’s own setup and avoid generic “overspending” warnings on categories they’ve said are important to them.

---

## Purpose

- **Who the user is:** life stage, dependants, income pattern.
- **What matters to them:** which categories are essential and where they expect to spend most.
- **Savings and flexibility:** main savings goal and where they’re willing to cut back.
- **Budget expectations:** so “overspend” is defined by the user, not a generic rule.
- **Alert preference:** how strict they want over-budget or overspending alerts.

After the survey, the system stores a **user profile** and uses it so that “over spending on a specific category” is evaluated against their stated priorities and limits, not a generic rule.

---

## Survey questions

### 1. Profile / context

**Q1. What best describes your life stage?**  
*(Single choice)*  
- Student  
- Young professional, no dependents  
- Supporting family  
- Pre-retirement  
- Retired  

**Q2. How many people depend on your income (including yourself)?**  
*(Single choice)*  
- 1  
- 2  
- 3  
- 4  
- 5+  

**Q3. How would you describe your income pattern?**  
*(Single choice)*  
- Fixed monthly salary  
- Variable (freelance, commissions)  
- Irregular  
- Student or low income  

---

### 2. Spending priorities (which categories “should” be high)

**Q4. Which of these are essential for you?** *(Select all that apply)*  
- Housing/Rent  
- Utilities  
- Groceries & food  
- Transport  
- Healthcare  
- Education  
- Insurance  
- Debt repayments  
- Savings/investments  
- Childcare  
- Other *(free text if needed)*  

**Q5. Which categories do you expect to spend the most on each month?** *(Pick up to 3)*  
*(Same category list as above, or a short list)*  

**Q6. Do you have any big, planned expenses in the next 12 months?** *(Optional)*  
- None  
- Wedding or event  
- Medical  
- Education  
- Travel  
- Home or car  
- Other  

---

### 3. Savings and flexibility

**Q7. What’s your main savings goal right now?**  
- No specific goal  
- Emergency fund  
- Big purchase (e.g. car, home)  
- Retirement  
- Paying off debt  
- Other  

**Q8. Where are you most willing to cut back if needed?** *(Pick up to 2)*  
- Eating out  
- Subscriptions  
- Shopping  
- Entertainment  
- Travel  
- Transport  
- Other  
- Prefer not to cut  

---

### 4. Budget expectations (so “overspend” is relative to the user)

**Q9. For your main spending categories, do you already have a monthly budget in mind?**  
- Yes, I have clear amounts  
- I have rough ranges  
- No, I want the app to suggest  

**Q10. *(If “Yes” or “rough ranges”)* Please give your expected monthly amount (or range) for your top 2–3 categories.**  
*(e.g. Housing: ______ , Food/Groceries: ______ , Transport: ______)*  

---

### 5. Optional: risk / alert preference

**Q11. How do you want the app to treat “over budget” or “overspending”?**  
- Alert me strictly when I go over my set limits  
- Only warn on big overruns  
- Use my survey answers to decide what’s “normal” for me and rarely warn  
- Just inform me, don’t warn  

---

## Summary table

| #   | Purpose |
|-----|--------|
| 1–3 | Who the user is (life stage, dependants, income type). |
| 4–6 | Which categories are important and where they expect to spend most. |
| 7–8 | Savings goal and where they’re okay cutting back. |
| 9–10| Their own budget expectations so “overspend” is defined by them. |
| 11  | How strict they want overspend/budget alerts. |

---

## User profile (stored after survey)

The system should store a **user profile** derived from the survey, for example:

| Field | Description | Source |
|-------|-------------|--------|
| `lifeStage` | Student / Young professional / Supporting family / Pre-retirement / Retired | Q1 |
| `dependantsCount` | 1–5+ | Q2 |
| `incomePattern` | Fixed / Variable / Irregular / Student or low income | Q3 |
| `essentialCategories` | List of category IDs or names | Q4 |
| `topSpendingCategories` | Up to 3 categories | Q5 |
| `plannedBigExpense` | None / Wedding / Medical / Education / Travel / Home or car / Other | Q6 (optional) |
| `savingsGoal` | No goal / Emergency fund / Big purchase / Retirement / Pay off debt / Other | Q7 |
| `flexibleCategories` | Up to 2 categories where user is willing to cut back | Q8 |
| `hasBudgetInMind` | Yes clear / Rough ranges / No, suggest | Q9 |
| `categoryBudgets` | Optional map: category → amount or { min, max } | Q10 |
| `alertPreference` | Strict / Big overruns only / Use survey, rarely warn / Inform only | Q11 |

This profile can live in the same `profiles` table (extended columns or JSON) or in a dedicated `user_finance_profile` or `onboarding_survey` table, depending on your schema.

---

## How the system uses the profile

1. **Anomaly detector / “unusual” transaction**  
   - When deciding if an amount is “anomalous,” consider the user’s **essential categories** and **top spending categories.**  
   - For categories they said are essential or where they expect to spend most, use **user-set budget ranges** (Q9–Q10) if present, or relax generic “high spend” flags so that important categories are less likely to trigger false “overspending” alerts.

2. **Budget / Flux Pods “over budget”**  
   - “Over budget” is defined by **their** limits (Q9–Q10), not a generic rule.  
   - Pods that match **essential categories** or **top spending categories** can be treated as higher priority; alerts can be softer or deferred for those if `alertPreference` is “Use my survey answers” or “Just inform me.”

3. **Alert strictness**  
   - **Strict:** alert whenever over set limits.  
   - **Big overruns only:** alert only when over by a significant margin (e.g. >10–20%).  
   - **Use survey, rarely warn:** only warn when spending is inconsistent with their stated priorities and budget expectations (e.g. large overrun on a non-essential, non-flexible category).  
   - **Inform only:** show information (e.g. “You’re 15% over your Housing budget”) without warning tone or blocking.

4. **Budget allocator / goal predictor**  
   - Optional: use `lifeStage`, `incomePattern`, and `savingsGoal` to tailor allocation suggestions and goal timelines (e.g. student vs supporting family vs retired).

5. **AI Companion / insights**  
   - Use `essentialCategories`, `flexibleCategories`, and `savingsGoal` to personalise tips (e.g. “You said you’re willing to cut back on Eating out; this month it’s 20% above your usual.”).

---

## Relation to deliverables

- This survey can be added as an **optional deliverable** (e.g. for **28th February** or a later milestone): “Onboarding survey and user profile driving personalised overspend and alert behaviour.”
- Implementing it involves: (1) survey UI (multi-step or single page), (2) profile storage (DB or local), (3) passing profile into anomaly/budget/alert logic, and (4) optional use in allocator, goal predictor, and Companion.

See **FEBRUARY_DELIVERABLES_PLAN.md** for where this fits in the February presentation plan.
