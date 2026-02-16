# February Deliverables – UniGuard Wallet  
## Project planning and execution readiness

This document defines the **two core deliverables** for February (presentations on **11th February** and **28th February**), aligned with the project’s research objectives and the existing system (AI-assisted personal finance app with trained model pipeline and integrated frontend).

---

## Deliverable 1: Presentation on **11th February**

### Title
**Trained and evaluated core AI models with integrated prototype**

### Expected deliverables for the 11th February presentation

The 11th February presentation is expected to include the following **two** deliverable types:

| Expected deliverable type | What we present on 11th February |
|--------------------------|-----------------------------------|
| **An improved prototype or functional system** | UniGuard Wallet as a working app: Transaction Center with Quick Entry, AI Recategorize, and anomaly badges; optional onboarding survey and user profile. The system is functional end-to-end with at least two AI-driven features. |
| **An integrated system with analytical capabilities** | The same app with trained models **integrated** via `AIService`: AI-powered transaction categorization, anomaly alerts, and in-app analytical capabilities (e.g. AI preview in Quick Entry, anomaly badges, confidence scores). Optional: onboarding profile used to personalise what counts as "normal" or "over budget." Supported by trained and evaluated models (transaction categorizer + anomaly detector; artifacts and evaluation report). |

Together, the 11th February deliverables are: an **improved prototype** and an **integrated system with analytical capabilities** (underpinned by trained and evaluated data models).

---

### 1. Objective of the deliverable – which research objective it achieves

- **Research objective:** Demonstrate that **data-driven model training** can replace simulated/rule-based behaviour and that trained artifacts can be **reliably integrated** into the application.
- This deliverable shows that the team can: (a) run the training pipeline on curated datasets, (b) produce and export TypeScript artifacts, (c) evaluate models on held-out data, and (d) integrate at least **two** trained models into the live app so that user-facing features (e.g. transaction categorization, anomaly detection) are driven by real trained parameters rather than hand-crafted simulations.

### 2. Key components or features and how they contribute to the final project

| Component / feature | Role in final project |
|--------------------|------------------------|
| **Transaction categorizer (trained)** | Powers Quick Entry and “AI Recategorize” in the Transaction Center; better keywords, token weights, and priors improve suggestion quality and top-3 accuracy. |
| **Anomaly detector (trained)** | Drives “AI Alert” badges on transactions; trained category stats (median, MAD, percentiles) define when a transaction is flagged as unusual, improving relevance of alerts. |
| **Training pipeline execution** | Proves reproducibility: same datasets and filters produce artifacts and metrics; foundation for adding the remaining models by 28th February. |
| **Evaluation report (e.g. `training/reports/latest.json` + HTML)** | Documents macro F1, top-3 accuracy, precision/recall/alert rate so the team can track quality and regressions. |

Together, these components establish that the **artifact-based integration pattern** (Python training → TypeScript artifacts → `AIService` → UI) works and that the first user-facing AI features are **data-driven**.

### 3. Technical work involved – what the team would do

- **Data and pipeline:** Ensure curated Kaggle datasets (see `training/data/CURATED_DATASETS.md`) are available; run the training pipeline for at least **transaction_categorizer** and **anomaly_detector** (e.g. `python training/train_models.py --model transaction_categorizer` and `--model anomaly_detector`, or equivalent batch).
- **Artifacts:** Confirm that artifact files under `src/lib/ai/models/artifacts/` (e.g. `transaction-categorizer.ts`, `anomaly-detector.ts`) are updated with the new trained parameters (keywords, token weights, priors, category stats).
- **Evaluation:** Record and present metrics from `training/reports/latest.json` (and optional `training_report.html`) – e.g. macro F1, top-3 accuracy for categorizer; precision, recall, alert rate for anomaly detector.
- **Integration check:** Verify that the Transactions page (Quick Entry, edit modal, anomaly badges) uses the updated artifacts via `aiService` with no regressions (smoke test with sample descriptions and amounts).
- **Documentation:** Briefly document which models were trained, which datasets and filters were used, and how to reproduce the run (and how the report metrics relate to app behaviour, per `training/data/TRAINING_OUTCOMES_AND_IMPACT.md`).

### 4. Scope and limitations

- **Scope:** Two models (transaction categorizer, anomaly detector) trained and integrated; evaluation on held-out data only; no real end-user data.
- **Limitations:** Other models (spending forecaster, budget allocator, goal predictor) may still use previous or simulated artifacts; generalisation is limited to the curated datasets and category schema; no live A/B comparison with the old simulated behaviour in this deliverable.

### 5. Technology Readiness Level (TRL) and relation to the system

- **TRL 4 – Component validation in a laboratory/relevant environment.**  
  The trained models are validated in the **relevant environment**: the same artifact format and `AIService` interface used in the real app, with the app running against the updated artifacts. The “laboratory” here is the development build of UniGuard Wallet with curated Kaggle data and synthetic or sample in-app transactions.  
- **Relation to system:** This deliverable raises the system from “simulated AI” to “at least two data-driven AI components (categorization and anomaly detection) validated in the actual application stack.”

---

### Optional addition for 11th February: Onboarding survey and user profile

As an **optional** part of what can be presented on **11th February**, the team may include an **onboarding survey** that captures user context so the system can treat spending as "normal" within the user's own setup and avoid generic "overspending" warnings on categories they've said are important.

- **Objective:** Show that user context (life stage, priorities, budget expectations, alert preference) can be captured and stored as a **user profile** for later use in personalising anomaly and over-budget behaviour.
- **Key components:** Survey UI (11 questions: profile/context, spending priorities, savings and flexibility, budget expectations, alert preference); profile storage (e.g. extend `profiles` or add `user_finance_profile`); see **ONBOARDING_SURVEY_SPEC.md** for full questions and schema.
- **Technical work (if included):** Implement survey flow (e.g. post-login or from Settings), persist profile, and optionally wire profile into anomaly or budget logic so alerts consider user-stated essentials and limits.
- **Scope if included:** Survey implemented and profile stored by 11th February; full integration with anomaly/budget logic can follow in the 28th February deliverable.

---

## Deliverable 2: Presentation on **28th February**

### Title
**Integrated finance system with full AI-driven analytical capabilities**

### 1. Objective of the deliverable – which research objective it achieves

- **Research objective:** Show that the **full set of AI models** can be trained, evaluated, and integrated into a **single coherent system** that delivers **analytical capabilities** across transactions, budgets (Flux Pods), goals, and reporting.
- This deliverable achieves: (a) all five models (transaction categorizer, spending forecaster, budget allocator, goal predictor, anomaly detector) trained and wired to the app; (b) analytical features (forecasts, allocation suggestions, goal predictions, anomaly alerts, and high-level insights) driven by trained artifacts; and (c) a clear link from training metrics to in-app behaviour, with optional preliminary results (e.g. summary of metrics or a short evaluation narrative).

### 2. Key components or features and how they contribute to the final project

| Component / feature | Role in final project |
|--------------------|------------------------|
| **All five trained models** | Categorizer and anomaly detector (Transactions); spending forecaster and budget allocator (Flux Pods – forecasts, velocity, new-pod suggestions); goal predictor (Goals – completion probability, months to complete); all feed into a consistent “AI layer” and future Companion/Reports. |
| **Flux Pods with trained forecaster and allocator** | Spending forecasts and “days until depletion” use trained seasonality and averages; new-pod allocation uses trained budget shares; contributes to the “integrated system with analytical capabilities” required by the brief. |
| **Goals with trained goal predictor** | Completion probability and success likelihood use trained savings rates by income bracket; supports the “analytical capabilities” and preliminary results (e.g. Brier score, MAE from report). |
| **Unified evaluation report** | Single place (e.g. `latest.json` + HTML) for all metrics (F1, MAPE, RMSE, Brier, precision/recall, etc.); supports “preliminary results” and traceability from training to app behaviour. |
| **Reports / dashboard insights (optional but recommended)** | If the Reports page or dashboard uses `getDashboardInsights()` or similar, it ties high-level analytics (savings rate, top categories, trends) to the same trained models and completes the “integrated system” story. |

Together, these components show a **complete pipeline**: data → training → artifacts → AIService → Transactions, Flux Pods, Goals, and (where implemented) Reports/Companion.

### 3. Technical work involved – what the team would do

- **Full pipeline run:** Execute training for all models (e.g. `python training/train_models.py --model all`), ensuring all artifact files in `src/lib/ai/models/artifacts/` are updated (transaction-categorizer, spending-forecaster, budget-allocator, goal-predictor, anomaly-detector).
- **Dataset and filter consistency:** Use the same curated sources and filters (allowed categories, min/max amounts, etc.) across runs so that metrics and artifacts are comparable and documented.
- **Integration verification:** For each feature that uses AI – Transactions (Quick Entry, recategorize, anomaly badges), Flux Pods (forecasts, new-pod suggestions), Goals (predictions) – confirm that the app imports and uses the new artifacts and that behaviour is consistent with the evaluation report (e.g. categorizer top-3 accuracy, anomaly precision/alert rate).
- **Preliminary results:** Summarise evaluation metrics (e.g. from `training/reports/latest.json`) and, if applicable, briefly describe how they relate to in-app behaviour (using `TRAINING_OUTCOMES_AND_IMPACT.md`). Optionally add a short “preliminary results” section (e.g. one page or slide) with key numbers and one or two example user flows.
- **Documentation and reproducibility:** Document the final dataset versions, filters, and commands so that the “integrated system” and “preliminary results” are reproducible.

### 4. Scope and limitations

- **Scope:** All five models trained and integrated; one coherent evaluation report; analytical capabilities demonstrated across Transactions, Flux Pods, and Goals; optional use of insights in Reports/Companion.
- **Limitations:** Training data remains **curated public Kaggle datasets** (no production user data); generalisation to other currencies or category schemas is untested; no formal user study or deployment to production; Companion/Reports may still be partially simulated if not fully wired to all model outputs.

### 5. Technology Readiness Level (TRL) and relation to the system

- **TRL 5 – System/subsystem validation in a relevant environment.**  
  The **full set of AI components** is integrated into the UniGuard Wallet application and validated together in a **relevant environment** (development build with the same stack and data flow as the target system). The system is a **prototype** that demonstrates end-to-end AI-driven analytics (categorization, anomaly detection, forecasting, allocation, goal prediction) in one product.  
- **Relation to system:** The system moves from “two data-driven models” (Feb 11) to a **single integrated finance system with analytical capabilities** powered by five trained models and a reproducible training-and-evaluation pipeline, suitable for presenting preliminary results and for future steps (e.g. TRL 6 with a pilot environment or real user data).

---

## Summary table

| Item | 11th February | 28th February |
|------|----------------|----------------|
| **Deliverable** | Improved prototype + integrated system with analytical capabilities (underpinned by trained models) | Integrated finance system with full AI-driven analytical capabilities |
| **Research objective** | Data-driven training and integration of at least two models | Full model set trained and integrated; system-level analytics |
| **Key components** | Improved prototype (working app, Transaction Center, optional onboarding); integrated system (AIService, categorizer + anomaly detector, evaluation report) | All five models, Flux Pods + Goals + Transactions, unified report, optional Reports/insights |
| **Technical work** | Train 2 models, update artifacts, evaluate, integrate, document | Train all models, update all artifacts, verify all integrations, document, preliminary results |
| **Scope / limitations** | 2 models; held-out evaluation only; no real user data | All models; still public Kaggle data; no production deployment |
| **TRL** | TRL 4 – Component validation in relevant environment | TRL 5 – System/subsystem prototype in relevant environment |

---

## Optional deliverable: Onboarding survey and personalised context

The onboarding survey is offered as an **optional addition under the 11th February deliverable** (see **Deliverable 1** above). If included, it captures user context and preferences so the system can treat spending as "normal" within the user's own setup and avoid generic "overspending" warnings.

- **Full spec:** Question list, answer options, stored profile schema, and how the system uses the profile are in **ONBOARDING_SURVEY_SPEC.md**.
- **By 11th February (optional):** Survey UI and profile storage; full integration with anomaly/budget logic can be completed by **28th February**.

---

## Incremental contribution to the final outcome

- **11th February** establishes that the **training → artifacts → app** pipeline works and that **at least two** user-facing AI features are driven by trained models, reducing risk and validating the approach.
- **28th February** delivers the **complete AI layer** and an **integrated system** with analytical capabilities, providing the basis for the third (later) deliverable—e.g. improved prototype with user feedback, or deployment-oriented validation—and for the final project outcome.
- **Optional (onboarding survey):** If included, it adds **personalised context** so that "overspend" and alerts are relative to the user's stated priorities and limits.

You can copy from this document into your project plan or presentation slides and adjust wording (e.g. “UniGuard Wallet” vs “the system”) to match your exact titles and research objectives.
