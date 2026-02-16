# UniGuard Wallet – February Deliverables (11th & 28th)

This document explains the **core project deliverables** to be presented on **11th February** and **28th February**, and how they fit into the overall research objectives.

---

## A. Deliverables for 11th February

### 1. Improved prototype / functional system

- **What this deliverable is**
  - A **working prototype** of UniGuard Wallet, focused on the **Transaction Center**.
  - The app runs end‑to‑end and can be demonstrated live (no mock-ups only).

- **Objective (research objective achieved)**
  - Show that the system has progressed from design to a **functional app** that real users could interact with.
  - Demonstrate that AI is **embedded in actual user flows**, not just in isolated scripts.

- **Key components and contribution to final project**
  - **Transaction Center UI**
    - Central hub for viewing and managing transactions.
    - Defines the main user workflow that later analytics will improve.
  - **AI‑enhanced flows**
    - **Quick Entry** for fast transaction capture.
    - **Edit dialog with “AI Recategorize”** to suggest better categories.
    - **AI anomaly badges** on suspicious transactions to draw attention to potential issues.
  - **(Optional) Onboarding survey**
    - Collects user context (life stage, spending priorities, alert strictness).
    - Sets up later personalisation of alerts and budgets.

- **Technical work to reach this deliverable**
  - Polish the React Transaction Center screens (layout, validation, loading states, toasts).
  - Ensure all buttons and flows (Quick Entry, Edit, Recategorize, anomaly badges) are wired and working.
  - Implement and persist onboarding survey data if included (simple profile stored per user).
  - Run end‑to‑end tests using realistic example transactions.

- **Scope and limitations**
  - **Scope:** Fully navigable, demo‑ready prototype with visible AI features in the Transaction Center.
  - **Limitations:** Only a subset of AI models is active; no real bank connections or production‑grade auth/security; onboarding data may not yet strongly influence model logic.

- **Technology Readiness Level (TRL)**
  - Approx. **TRL 4** – prototype / component validation in a relevant environment (real UI + app stack, but not production).

---

### 2. Integrated system with analytical capabilities (first slice)

- **What this deliverable is**
  - A **first integrated slice** where two trained models drive real features in the app:
    - **Transaction categorizer**.
    - **Anomaly detector**.
  - These models are connected via a central `AIService` and power categorisation and alerts in the Transaction Center.

- **Objective (research objective achieved)**
  - Prove that **trained, evaluated models** can be embedded into the application and used in practice.
  - Replace purely rule‑based logic with data‑driven behaviour while keeping the integration clean.

- **Key components and contribution to final project**
  - **AIService integration layer**
    - Provides functions such as `categorizeTransaction` and `detectAnomaly`.
    - Decouples UI from model internals, making later upgrades and new models easier.
  - **Trained transaction categorizer**
    - Suggests categories and confidence scores for Quick Entry and Recategorize.
    - Improves speed and consistency of transaction labelling.
  - **Trained anomaly detector**
    - Flags unusual transactions with severity and short reasons (AI alerts).
    - Forms the basis for fraud/spending‑pattern monitoring.
  - **Evaluation report**
    - Metrics (macro F1, top‑3 accuracy, precision/recall/alert rate) explain how reliable the models are.
    - Provides a baseline to compare future improvements.

- **Technical work to reach this deliverable**
  - Run the Python training pipeline on curated Kaggle datasets for:
    - `transaction_categorizer` and `anomaly_detector`.
  - Export artifacts (weights, priors, category statistics) to TypeScript files under `src/lib/ai/models/artifacts/`.
  - Ensure model code and `AIService` use these trained artifacts.
  - Wire Transaction Center flows to call `AIService` and visually verify suggestions and alerts.
  - Generate and include the latest training report as evidence of performance.

- **Scope and limitations**
  - **Scope:** Two models trained, evaluated, and integrated into the running app; analytics demonstrated in the Transaction Center.
  - **Limitations:** Other models (forecaster, budget allocator, goal predictor) are not yet part of this integrated slice; data is curated/public only; no production deployment or user study.

- **Technology Readiness Level (TRL)**
  - **TRL 4** – component‑level analytical capabilities validated in the actual app environment.

---

## B. Deliverables for 28th February

### 3. Integrated finance system with full AI‑driven analytical capabilities

- **What this deliverable is**
  - A more complete, **second‑stage system** where **all five models** are trained and integrated:
    - Transaction categorizer.
    - Anomaly detector.
    - Spending forecaster.
    - Budget allocator.
    - Goal predictor.
  - The app now supports analytics across **Transactions**, **Flux Pods (budgets)**, and **Goals**, with a unified evaluation report and preliminary results.

- **Objective (research objective achieved)**
  - Demonstrate a **coherent, analytical finance assistant**, not just individual AI features.
  - Achieve system‑level research goals: combined use of multiple models for categorisation, anomaly detection, forecasting, budgeting, and goal prediction.

- **Key components and contribution to final project**
  - **All five trained models in production paths**
    - Transactions: categorizer + anomaly detector.
    - Flux Pods: spending forecaster + budget allocator for days‑to‑depletion, suggested allocations, and risk.
    - Goals: goal predictor for completion probability and months‑to‑target.
  - **Unified evaluation report and preliminary results**
    - Single place for all key metrics (F1, MAPE, RMSE, Brier, precision/recall, etc.).
    - Short narrative linking those metrics to what users see in the app.
  - **Analytics surfaces (UI)**
    - Flux Pods show predicted spend, risk level, and days until budget depletion.
    - Goals show probability of success and likely completion timeline.
    - (Optional) Reports/dashboard summarise savings rate, top categories, and trends.
  - Together, this delivers an **integrated analytical system**, ready to be tuned with real data in later phases.

- **Technical work to reach this deliverable**
  - Run the training pipeline for **all models** (e.g. `train_models.py --model all`).
  - Export and version all artifacts to `src/lib/ai/models/artifacts/`.
  - Connect each feature area (Transactions, Flux Pods, Goals, Reports) to the appropriate `AIService` calls.
  - Verify via manual tests and sample scenarios that outputs look reasonable and consistent with metrics.
  - Summarise metrics and “preliminary results” in a short internal report or slide.

- **Scope and limitations**
  - **Scope:** All AI components wired into the live app; analytics visible across multiple screens; full evaluation report produced.
  - **Limitations:** Still based on public/curated datasets; no real‑user calibration; not yet deployed as a production service; user studies and long‑term monitoring remain future work.

- **Technology Readiness Level (TRL)**
  - **TRL 5** – system/subsystem validation in a relevant environment.
  - The app behaves as an integrated finance system with AI‑driven analytics, suitable for pilot testing and further refinement.

---

**Incremental story:** 11th February proves the **functional prototype** and an initial **analytical integration** (two models). 28th February extends this to a **full AI layer** and a truly **integrated system**, setting up the final phase (post‑February) for real‑data pilots and higher TRL.

