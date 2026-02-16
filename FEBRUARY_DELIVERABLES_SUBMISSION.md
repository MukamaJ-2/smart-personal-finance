# Project Planning and Execution Readiness — UniGuard Wallet
## Two Core Deliverables (11th & 28th February)

This document identifies the two core deliverables for **11th February** and **28th February** and how they contribute to the final outcome. Deliverables align with: improved prototype/functional system; trained and evaluated data model; integrated system with analytical capabilities; preliminary results.

---

## DELIVERABLE 1: Presentation on 11th February

**Description:** The 11th February deliverables are **(1) An improved prototype or functional system** and **(2) An integrated system with analytical capabilities.** *Improved prototype:* UniGuard Wallet as a working app — Transaction Center with Quick Entry, AI Recategorize, anomaly badges; optional onboarding survey. *Integrated system:* Trained models (transaction categorizer + anomaly detector) wired via AIService; AI-powered categorization, anomaly alerts, and in-app analytics (AI preview, confidence scores). The trained models are evaluated (F1, top-3 accuracy, precision/recall/alert rate; artifacts + report) and support both the prototype and the integrated system.

**1. Objective** — Demonstrate that data-driven model training can replace simulated behaviour and that trained artifacts integrate reliably. Shows: pipeline run on curated data → TypeScript artifacts → evaluation on held-out data → at least two models (categorizer, anomaly detector) in the live app.

**2. Key components** — *Transaction categorizer (trained):* Quick Entry & AI Recategorize; keywords/weights/priors improve suggestions. *Anomaly detector (trained):* AI Alert badges; category stats (median, MAD, percentiles) flag unusual transactions. *Pipeline & report:* Reproducibility; foundation for Feb 28; metrics for quality/regressions.

**3. Technical work** — Run training for `transaction_categorizer` and `anomaly_detector` on curated Kaggle data; update artifacts in `src/lib/ai/models/artifacts/`; record metrics from `training/reports/latest.json`; verify Transactions page uses artifacts via AIService; document datasets, filters, reproduction steps.

**4. Scope & limitations** — Scope: two models trained and integrated; held-out evaluation only; no real user data. Limitations: other models may still use simulated artifacts; generalisation limited to curated schema; no A/B comparison.

**5. TRL** — **TRL 4 (Component validation in relevant environment).** Models validated in dev build with same artifact format and AIService; system moves from “simulated AI” to two data-driven components (categorization, anomaly detection) in the application stack.

---

## DELIVERABLE 2: Presentation on 28th February

**Description:** (1) **Improved prototype:** Full app with AI across Transactions, Flux Pods, Goals. (2) **Trained & evaluated models:** All five (categorizer, spending forecaster, budget allocator, goal predictor, anomaly detector); unified evaluation report. (3) **Integrated system:** All models via AIService — forecasts, allocation suggestions, goal predictions, insights. (4) **Preliminary results:** Summary metrics and link to in-app behaviour.

**1. Objective** — Show that the full set of AI models can be trained, evaluated, and integrated into one coherent system with analytical capabilities across transactions, Flux Pods, goals, and reporting. Achieves: five models wired to app; analytical features from trained artifacts; link from metrics to behaviour; optional preliminary results narrative.

**2. Key components** — *All five models:* Transactions (categorizer, anomaly); Flux Pods (forecaster, allocator — forecasts, velocity, new-pod suggestions); Goals (goal predictor — completion probability). *Unified report:* All metrics (F1, MAPE, RMSE, Brier, precision/recall). *Reports/dashboard (optional):* Insights tied to models. Complete pipeline: data → training → artifacts → AIService → UI.

**3. Technical work** — Run `train_models.py --model all`; update all artifacts; same curated sources/filters; verify integration (Transactions, Flux Pods, Goals); summarise metrics and relation to app behaviour; document for reproducibility.

**4. Scope & limitations** — Scope: five models trained and integrated; one evaluation report; analytics in Transactions, Flux Pods, Goals. Limitations: training on public Kaggle data only; no production deployment or user study; Companion/Reports may remain partially simulated.

**5. TRL** — **TRL 5 (System/subsystem validation in relevant environment).** Full AI set integrated and validated in dev build; prototype demonstrating end-to-end analytics. System becomes a single integrated finance system with analytical capabilities; basis for TRL 6 (e.g. pilot or real user data).

---

## Incremental contribution to final outcome

**11th February** validates the training → artifacts → app pipeline and two user-facing AI features, reducing risk before scaling. **28th February** delivers the complete AI layer and integrated system with analytical capabilities, providing the basis for the third (later) deliverable and the final project output. The two February deliverables are incremental: the first proves the pipeline and two components; the second extends to the full model set and integrated analytics.
