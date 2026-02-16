# UniGuard Wallet – 11th February Deliverables

## 1. Improved prototype / functional system

- **What this deliverable is**
  - A polished, working prototype of UniGuard Wallet focused on the **Transaction Center**.
  - The app runs end‑to‑end and can be demonstrated live (no mock screenshots only).
  - Key visible features:
    - Transaction table with search and filters.
    - **Quick Entry** for fast transaction capture.
    - **Edit dialog** with an **AI Recategorize** button.
    - **AI anomaly badges** on suspicious transactions.
    - *(Optional)* Onboarding survey that collects user context (life stage, priorities, alert strictness) and stores a user profile.

- **Objective (research objective achieved)**
  - Show that the system has moved from a design concept to a **functional prototype** that real users could plausibly interact with.
  - Demonstrate that AI features are **embedded in real workflows** (adding/editing transactions, noticing alerts), not just isolated algorithms.

- **Key components and contribution to the final project**
  - **Transaction Center UI**
    - Central place where users see and manage all transactions.
    - Becomes the main “laboratory” where model outputs are surfaced and evaluated.
  - **AI‑enhanced flows**
    - Quick Entry + AI Recategorize reduces friction in data entry and improves category consistency.
    - Anomaly badges give immediate visual feedback when something looks unusual.
  - **Onboarding survey (optional)**
    - Captures what “normal spending” and “strict alerting” mean **for each user**.
    - Sets up later phases where models and alerts are personalised rather than generic.
  - Overall, this prototype defines the **user experience shell** into which all later models and analytics will plug.

- **Technical work to achieve this deliverable**
  - Finalise and polish React pages for the Transaction Center (layout, error handling, loading states, toasts).
  - Wire all UI actions (Quick Entry, Recategorize button, anomaly badges) through a clean interface (`AIService`) so the front‑end does not call models directly.
  - For onboarding (if included):
    - Implement a multi‑step form.
    - Persist answers as a structured profile (even if just a simple table/JSON field for now).
  - Perform smoke‑tests of end‑to‑end flows with realistic example data.

- **Scope and limitations**
  - Scope:
    - Prototype is **fully navigable and demo‑ready**.
    - AI hooks are present and interactive in the UI.
  - Limitations:
    - Only a subset of models is connected at this stage.
    - No real bank connections or production‑grade security.
    - Personalisation from onboarding may be stored but not heavily used by models yet.

- **Technology Readiness Level (TRL)**
  - Approx. **TRL 4** – component / prototype validation in a relevant environment.
  - Demonstrates realistic user flows in the same tech stack that will be used later, but still at prototype stage (no production deployment).

---

## 2. Integrated system with analytical capabilities (first slice)

- **What this deliverable is**
  - A **working integration** between trained models and the app:
    - Transaction categorizer.
    - Anomaly detector.
  - These models are not just trained offline; they actively power features in the Transaction Center via `AIService`.

- **Objective (research objective achieved)**
  - Prove that **trained models can be embedded into the system** and drive live behaviour.
  - Achieve the research goal of replacing rule‑based logic with **trained, evaluated models** while keeping the integration maintainable.

- **Key components and contribution to the final project**
  - **AIService integration layer**
    - Exposes functions like `categorizeTransaction` and `detectAnomaly`.
    - Decouples UI from model internals, making it easy to swap in new models or backends later.
  - **Trained transaction categorizer in the app**
    - Suggests categories and confidence scores for Quick Entry and Recategorize.
    - Provides consistent, explainable categorisation — a core capability for any finance assistant.
  - **Trained anomaly detector in the app**
    - Flags unusual transactions as “AI alerts” with severity and brief reasoning.
    - Lays the foundation for fraud detection / spending‑pattern analysis.
  - **Evaluation report linked to behaviour**
    - Metrics (macro F1, top‑3 accuracy, precision/recall/alert rate) explain how reliable the suggestions and alerts are.
    - Serves as a baseline for future improvement and regression checks.

- **Technical work to achieve this deliverable**
  - Run the Python training pipeline on curated Kaggle datasets for:
    - `transaction_categorizer`
    - `anomaly_detector`
  - Export trained artifacts (weights, priors, category stats) into TypeScript files under `src/lib/ai/models/artifacts/`.
  - Ensure model modules import these artifacts and that `AIService` uses them (not hard‑coded rules).
  - Connect UI flows to `AIService` calls, then manually verify:
    - Categories suggested for a variety of descriptions and amounts.
    - Anomaly flags on clearly unusual vs typical transactions.
  - Generate and include the evaluation report (`training/reports/latest.json` and HTML) as evidence of performance.

- **Scope and limitations**
  - Scope:
    - Only **two** models (categorizer and anomaly detector) are fully trained, evaluated, and integrated.
    - Analytical capabilities are demonstrated mainly in the **Transaction Center**.
  - Limitations:
    - Forecasting, budgeting, and goal‑prediction models are not the focus of this February 11th integrated slice.
    - Data is curated/public, not real customer data; no formal calibration to live behaviour yet.

- **Technology Readiness Level (TRL)**
  - **TRL 4** – component validation in a relevant environment from an analytics perspective.
  - Trained components run inside the real app architecture and UI, ready to be expanded to more models and higher TRLs in later milestones.

