# 🍲 SmartFood Rescue AI
> **Tagline:** *“Predict. Rescue. Redistribute. Measure.”*  
> **Smart India Hackathon Software Edition**  
> **Team Name:** Annadata AI  
> **Repository:** `SmartFood-Rescue-AI_SIH_2026`  
> **Demonstration Pilot:** Vijayawada, Andhra Pradesh, India 🇮🇳  

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime_Web-v1.21-005CED?style=flat&logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![Claude 3.5 / Gemini](https://img.shields.io/badge/Gen_AI-Claude_3.5_/_Gemini-D97706?style=flat&logo=anthropic&logoColor=white)](https://anthropic.com)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![SIH 2026](https://img.shields.io/badge/SIH-2026-FF9933?style=flat&logo=target&logoColor=white)](https://www.sih.gov.in/)
[![Hosting: Live](https://img.shields.io/badge/Live_Demo-Firebase_Hosting-0288D1?style=flat&logo=google-cloud&logoColor=white)](https://smartfood-rescue-ai-25f38.web.app)
[![Zero Hardware Required](https://img.shields.io/badge/Hardware-Software_Simulation_Mode-10B981?style=flat&logo=cpu&logoColor=white)](#-virtual-iot-monitoring-simulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Executive Summary

SmartFood Rescue AI is a software-first decision-support platform for institutional kitchens, cafeterias, hostels, caterers, and food-processing units. It reduces avoidable food waste through an intelligent, closed operational loop:

1. **Forecast food demand** before cooking using rule-based statistical smoothing.
2. **Register prepared and served food batches** with automatic delta surplus calculation.
3. **Inspect food spoilage in real time** using client-side **Edge Computer Vision (YOLOv8 ONNX via `onnxruntime-web`)** directly through a webcam.
4. **Simulate storage telemetry** (temperature, humidity, weight, duration) and enforce strict food safety thresholds without physical hardware.
5. **Evaluate multi-factor quality-risk safety gates** combining visual AI inferences, sensor readings, packaging integrity, and mandatory authorised human review.
6. **Synthesize operational urgency** using an AI-powered **“Today’s Rescue Intelligence”** agent (Anthropic Claude 3.5 / Google Gemini) with Firestore daily caching.
7. **Match eligible surplus** with nearby vetted shelters using a multi-criteria algorithm calibrated for Vijayawada, Andhra Pradesh.
8. **Plan time-aware transit routes** with vehicle-specific speed models to guarantee delivery feasibility before use-by deadlines.
9. **Automate event-driven workflows** with **5 serverless Firebase Cloud Functions** (IoT thermal breach checks, real-time NGO alerts, ESG ledger updates, and scheduled cron digests).
10. **Measure ESG sustainability impact** tracking food waste prevented, meals saved, estimated cost savings (₹), and estimated carbon emissions mitigated ($\text{CO}_2\text{e}$).

> **Prototype disclaimer:** All NGO, sensor, route, and logistics data are simulated for the Vijayawada pilot. The application supports decisions; it does not certify food safety or replace authorised human review.

---

## 📖 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [Technology Stack & Core Dependencies](#-technology-stack--core-dependencies)
4. [Mathematical Models & Decision Formulas](#-mathematical-models--decision-formulas)
5. [Key Features & Application Pages](#-key-features--application-pages)
6. [Interactive Evaluator Tour & UI/UX Features](#-interactive-evaluator-tour--uiux-features)
7. [Role-Based Access Control & Firebase Authentication](#-role-based-access-control--firebase-authentication)
8. [Virtual IoT Simulator (Hardware-Free Implementation)](#-virtual-iot-monitoring-simulator)
9. [Serverless Cloud Functions & Backend Automation](#-serverless-cloud-functions--backend-automation)
10. [Canonical Hackathon Demo Scenario (Vijayawada)](#-canonical-hackathon-demo-scenario-vijayawada)
11. [Kaggle Synthetic Dataset Integration & Ingestion Pipeline](#-kaggle-synthetic-dataset-integration--ingestion-pipeline)
12. [SIH 2026 Presentation Deck & Visual Assets](#-sih-2026-presentation-deck--visual-assets)
13. [Application Screenshots](#-application-screenshots)
14. [Quick Start & Comprehensive Installation Guide](#-quick-start--comprehensive-installation-guide)
15. [Project Directory Structure](#-project-directory-structure)
16. [Judge / Evaluator Walkthrough Script](#-judge--evaluator-walkthrough-script)
17. [Compliance & Ethical Disclaimers](#-compliance--ethical-disclaimers)
18. [Future Production Roadmap](#-future-production-roadmap)
19. [Team & Attribution](#-team--attribution)

---

## 📌 Project Overview & Problem Statement

### The Problem in Institutional Kitchens
College canteens, university hostels, hospital cafeterias, large caterers, and food processing facilities face acute unpredictability in daily attendance and dining volume:
- Kitchen administrators fear food shortages, consistently cooking **15% to 25% more meals** than consumed.
- Excess cooked food sits in warm ambient temperatures without automated shelf-life tracking or real-time spoilage inspection.
- Due to a lack of verified logistical networks, wholesome residual meals end up in municipal landfills.
- Decomposing organic food waste in open dumps emits massive volumes of **methane ($\text{CH}_4$)**, a potent greenhouse gas, while universities incur heavy financial losses.

### The Solution: SmartFood Rescue AI
A software-first, closed-loop platform that integrates:
1. **Rule-Based Forecasting Engine with Statistical Smoothing** to prevent overproduction at the source.
2. **Automated Surplus Detection & Batch Registration** to quantify residual food immediately after service.
3. **In-Browser Edge AI Spoilage Computer Vision** via YOLOv8 ONNX models running directly on webcam feeds with zero server latency.
4. **Virtual IoT Storage Telemetry** to track temperature, humidity, and storage hours without physical hardware.
5. **Algorithmic Decision-Support Quality Gate** to evaluate risk conditions before human review.
6. **GenAI Rescue Intelligence Synthesis** delivering instant operational dispatch briefings to kitchen coordinators.
7. **Multi-Criteria NGO Matching Radar** in Vijayawada to pair batches with nearby vetted shelters.
8. **Time-Aware Route Planning** with vehicle-specific speed models to estimate delivery feasibility before redistribution deadlines.
9. **Event-Driven Serverless Architecture** running Cloud Functions for automated quality inspection, NGO push notifications, and immutable ESG accounting.
10. **Transparent ESG & Sustainability Accounting** measuring meals rescued, estimated cost savings (₹), and estimated $\text{CO}_2\text{e}$ mitigated.

---

## 🏗️ End-to-End System Architecture

SmartFood Rescue AI is engineered as a resilient **4-tier modular web application** pairing client-side edge computing with cloud serverless automation. The system cleanly separates presentation, edge ML inference, simulated IoT telemetry, serverless background workers, and browser-local persistent caching. This ensures zero runtime failures, zero latency, and zero dependency on external network services during live hackathon evaluation.

### The 4-Tier Architectural Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. PRESENTATION & INTERACTION LAYER                   │
│   React 19 (Component Hierarchy) • Tailwind CSS v4 • Lucide React • Recharts│
│   [Landing] [Dashboard] [Forecast] [Batches] [IoT Sim] [Quality] [Matching] │
│   [Route Plan] [ESG Analytics] [Reports] [Settings] [Role Switcher]         │
│   • QualityCamera (Webcam Stream + 2s Canvas Sampler + Edge ONNX Predictor) │
│   • RescueInsightCard (Green Radar Pulse + Live 20ms Typewriter Synthesis)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ State, Streams & Event Dispatch
┌──────────────────────────────────────▼──────────────────────────────────────┐
│             2. EDGE INTELLIGENCE & ALGORITHMIC DECISION LAYER               │
│       Client-Side ONNX Runtime Web + Pure Deterministic TypeScript Engines  │
│   • In-Browser Edge Vision: YOLOv8 ONNX Model (Fresh / Mild / Spoiled)      │
│   • Demand Forecasting Engine (Historical smoothing + contextual modifiers) │
│   • Quality Assessment Gate (Deduction-based 100-pt safety scoring)         │
│   • NGO Match Radar (Multi-criteria weighted distance, capacity, urgency)   │
│   • Logistics Routing Engine (Vehicle-specific velocity & feasibility model) │
│   • ESG Impact Ledger (Standardized conversion: 4 meals/kg, ₹200/kg, CO2e)  │
└───────────────────▲──────────────────────────────────────┬──────────────────┘
                    │                                      │
┌───────────────────┴──────────────────┐ ┌─────────────────▼──────────────────┐
│  3. VIRTUAL TELEMETRY & SIMULATOR    │ │ 4. CLOUD SERVERLESS & PERSISTENCE  │
│  • Hardware-Free Sensor Simulation   │ │ • Firebase Auth (Anonymous Sessions│
│  • Temperature, Humidity & Weight    │ │   & Firestore users/{uid} Profiles)│
│  • Safe/Breach Threshold Triggers    │ │ • Cloud Functions v7 (6 Triggers): │
│  • Visual Badges & Alert Overrides   │ │   - generateRescueInsight (Claude) │
│  • Cross-Component Reactive Sync     │ │   - onBatchCreated (Temp Breach)   │
│                                      │ │   - onBatchStatusChanged (NGO Push)│
│                                      │ │   - onDeliveryCompleted (Audit Log)│
│                                      │ │   - weeklyESGDigest (Monday Cron)  │
│                                      │ │   - onIoTThresholdBreach (Alerts)  │
│                                      │ │ • LocalStorage v2 Resilient Cache  │
│                                      │ │   (Offline-First Zero-Crash Fallback)
└──────────────────────────────────────┘ └────────────────────────────────────┘
```

### End-to-End Operational Lifecycle Workflow

SmartFood Rescue AI connects every stakeholder in institutional food service—from kitchen chefs to quality evaluators, shelter directors, couriers, and sustainability managers—through a synchronized, closed-loop operational pipeline. The workflow prevents overproduction at the source, enforces algorithmic food safety gates, optimizes local transit, and creates immutable sustainability audit trails.

```mermaid
flowchart TD
    subgraph PHASE1["Phase 1: Pre-Cooking Demand Forecasting & Prevention"]
        A["Expected Attendance & Calendar Flags"] --> B["Rule-Based Forecasting Engine with Smoothing"]
        B -->|"Recommended Quantity + 5% Calibrated Buffer"| C["Kitchen Meal Batch Preparation"]
    end

    subgraph PHASE2["Phase 2: Post-Service Surplus Detection & Digital Logging"]
        C --> D["Prepared vs Served Delta Audit"]
        D -->|"Surplus Quantified (kg & Category)"| E["Food Batch Digital Registry"]
        E -->|"Shelf-Life Clock Initiated"| E_STORE["LocalStorage v2 & Firestore Event Queue"]
    end

    subgraph PHASE3["Phase 3: Edge AI Vision & Multi-Factor Quality Gate"]
        E --> F["Virtual IoT Telemetry Simulator (Temp, RH, Weight)"]
        E --> G_CAM["Live Webcam QualityCamera"]
        G_CAM -->|"2-Second Canvas Sampling"| G_ONNX["ONNX Runtime Web (YOLOv8 Edge Model)"]
        G_ONNX -->|"Fresh (0) | Suspicious (-15) | Spoiled (-30)"| G["Multi-Factor Quality Deduction Gate (100 pts)"]
        F -->|"Thermal Breach Check (-35 pts) & Duration Check"| G
        G -->|"Quality Score Evaluated (0 - 100)"| H{"Score >= 80 & Within Window?"}
        H -->|"Passed (Score >= 80)"| I["Authorised Human Quality Review & Sign-Off"]
        H -->|"Failed (Score < 50 or Spoiled)"| J["Diverted to Composting & Disposal"]
        H -->|"Borderline (50 - 79)"| J_WARN["Physical Inspection Required"]
    end

    subgraph PHASE4["Phase 4: AI Rescue Intelligence & NGO Matching Radar"]
        I --> INSIGHT["RescueInsightCard (Local Zero-Latency Engine / Claude 3.5)"]
        I --> K["Vijayawada Multi-Criteria NGO Match Radar"]
        K -->|"Weighted Match: Distance (35%), Capacity (25%), Dietary (20%), Availability (20%)"| L["Top Recipient NGO Matched & Broadcasted"]
        L -->|"Instant Order Claim & Slot Approval"| L_DISPATCH["Logistics Dispatch Triggered"]
    end

    subgraph PHASE5["Phase 5: Time-Aware Live OpenStreetMap Routing & Handover"]
        L_DISPATCH --> M["Live OpenStreetMap Interactive Routing Engine"]
        M -->|"Transit Velocity Formula: (dist / speed) * 60 + 10m"| M_ETA["Time-Aware Delivery Feasibility Check"]
        M_ETA -->|"ETA < Deadline (Feasible)"| N["Driver Dispatched & Hot Containers Loaded"]
        N -->|"Corridor Tracking: MG Road Hub to Benz Circle Shelter"| N_TRANSIT["In-Transit Tracking & Step Progress (1-6)"]
        N_TRANSIT -->|"Physical Handover & Photo Proof Upload"| N_DELIVERY["Delivery Completed & Signed Off"]
    end

    subgraph PHASE6["Phase 6: Closed-Loop ESG Accounting & Audit Trail"]
        N_DELIVERY --> O["Automated ESG Ledger Accounting"]
        O --> P1["Meals Rescued (4 meals / kg)"]
        O --> P2["Institutional Cost Saved (Rs 200 / kg)"]
        O --> P3["CO2e Mitigated (2.5 kg CO2e / kg)"]
        O --> Q["Tamper-Proof Audit Trail & Regulatory ESG Reports"]
        Q -.->|"Feedback Loop: Consumption Delta Refines Historical Moving Averages"| A
    end
```

#### Operational Lifecycle Matrix

| Phase | Primary Actor | Inputs & Signals | Decision Engine / AI Technology | Operational Output & Safety SLA |
| :--- | :--- | :--- | :--- | :--- |
| **1. Demand Forecasting** | Kitchen Staff / Head Chef | Expected attendance, day of week, campus events, special feast flags, 7-day rolling average. | Rule-Based Statistical Smoothing Engine ($0.92 \times \text{attendance} \pm \text{modifiers} + 5\%\text{ buffer}$). | Recommended cooking volume in meals and kg to avert overproduction. |
| **2. Surplus Audit** | Kitchen Staff | Total meals prepared, trays returned from serving counter, timestamp. | Automated delta surplus calculator: $\text{Surplus} = \text{Prepared} - \text{Consumed}$. | Unique batch registered (`BATCH-2026-XXX`), initiating countdown to consumption use-by deadline. |
| **3. Quality Safety Gate** | Food Safety Officer / Supervisor | Live webcam feed, virtual IoT thermal data (ambient/storage temp, humidity), packaging seal status. | In-browser **ONNX Runtime Web (YOLOv8)** classification + 100-point multi-factor deduction model. | Deductions calculated. Score $\ge 80/100$ unlocks human sign-off; $<50$ diverts to organic composting. |
| **4. Rescue Intelligence & Matching** | NGO Coordinator / Dispatcher | Batch quantity, food category, shelf-life window, shelter capacities and locations across Vijayawada. | **RescueInsightCard** (deterministic local engine + Claude 3.5 fallback) + 4-factor weighted NGO match radar. | 3-point actionable dispatch recommendations synthesized and top recipient NGO paired (e.g., Hope Food Bank, 91% match). |
| **5. Live Route Dispatch** | Assigned Courier / Driver | Origin kitchen coordinates, destination shelter coordinates, vehicle type (Auto, Bike, Van). | **Live OpenStreetMap Engine (Leaflet)** with vehicle speed-calibrated travel time formula. | 6-step dispatch pipeline (Request $\rightarrow$ Accept $\rightarrow$ Assign $\rightarrow$ Collect $\rightarrow$ Transit $\rightarrow$ Handover). |
| **6. Closed-Loop ESG Audit** | Institutional Admin / ESG Auditor | Confirmed delivered kg, delivery proof photo, recipient acknowledgement timestamp. | Standardized environmental conversion formulas ($4\text{ meals/kg}$, $₹200/\text{kg}$, $2.5\text{ kg CO}_2\text{e/kg}$). | Immutable ESG ledger updated; audit reports downloadable in CSV/print; consumption delta calibrates future forecasts. |

---

## 🛠️ Technology Stack & Core Dependencies

The platform is constructed on modern, type-safe web technologies configured for instant rendering, rapid feedback loops, and production reliability.

| Layer / Role | Technology / Package | Version | Architectural Justification & Responsibility |
|:---|:---|:---|:---|
| **Core Framework** | [React](https://react.dev/) | `^19.2.8` | Component-driven UI architecture leveraging React 19 modern rendering model and client-side reactive hooks (`useState`, `useEffect`, `useCallback`, `useMemo`). |
| **DOM Renderer** | [React DOM](https://react.dev/) | `^19.2.8` | High-performance reconciliation and DOM manipulation engine. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.2` | Complete static type safety across all domain interfaces (`FoodBatch`, `DemandForecast`, `SensorTelemetry`, `NgoProfile`, `RoutePlan`, `EsgMetrics`), eliminating runtime reference exceptions. |
| **Edge ML Inference** | [ONNX Runtime Web](https://onnxruntime.ai/) | `^1.21.0` | Client-side neural network runtime running YOLOv8 food spoilage ONNX model directly inside the browser using WebAssembly / WebGL with zero server latency. |
| **Generative AI** | [Anthropic Claude 3.5](https://anthropic.com) / [Google Gemini](https://ai.google.dev/) | API / SDK | Serverless LLM synthesis generating high-urgency 2-sentence operational briefings for kitchen coordinators via Firebase Cloud Functions. |
| **Build Engine & Dev Server** | [Vite](https://vite.dev/) | `^8.3.0` | Next-generation bundler delivering lightning-fast sub-100ms Hot Module Replacement (HMR) and optimized rollup production bundles. |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) | `^4.3.3` | Tailwind v4 CSS-first design system engine via `@tailwindcss/vite`, generating zero-runtime utility classes with modern emerald/amber/rose color palettes and glassmorphism. |
| **Vite React Plugin** | [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | `^6.1.1` | Enables fast React JSX transformation, Fast Refresh, and Babel/SWC optimizations. |
| **Data Visualization** | [Recharts](https://recharts.org/) | `^3.10.1` | Responsive, composable SVG charting for dynamic demand forecasting trends, 24-hour virtual sensor curves, and ESG cumulative impact graphs. |
| **Iconography Suite** | [Lucide React](https://lucide.dev/) | `^1.48.0` | Accessible, unified vector icons across all navigation bars, status badges, sensors, map pins, and action buttons. |
| **CSS Utility Helpers** | [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge) | `^2.1.1` & `^3.7.0` | Conflict-free conditional class concatenation and dynamic Tailwind variant merging. |
| **Micro-Interactions** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | `^1.9.4` | Lightweight celebratory physics animation triggered upon successful food rescue dispatch and receipt completion. |
| **Static Code Quality** | [Oxlint](https://oxc-project.github.io/) | `^1.81.0` | High-performance Rust-based static analyzer enforcing clean code, optimal patterns, and zero lint warnings across the codebase. |
| **Type Definitions** | `@types/node`, `@types/react`, `@types/react-dom`, `@types/canvas-confetti` | Latest | Standardized type declarations for browser and Node.js toolchain interoperability. |
| **Authentication & Auth State** | [Firebase Auth](https://firebase.google.com/docs/auth) | `^12.19.0` | Anonymous session initialization and state synchronization with Firestore `users/{uid}` role records, coupled with zero-crash LocalStorage fallback. |
| **Cloud Services & Database** | [Firebase Firestore](https://firebase.google.com/docs/firestore) | `^12.19.0` | Real-time NoSQL cloud database for food batches, notification queues, audit logs, and persistent monthly ESG ledgers. |
| **Serverless Functions** | [Firebase Functions](https://firebase.google.com/docs/functions) | `^7.0.0` | TypeScript serverless Cloud Functions codebase (`functions/`) for automated scheduled audits, real-time alerts, and backend webhook triggers. |
| **Edge CDN Hosting** | [Firebase Hosting](https://firebase.google.com/docs/hosting) | Global CDN | Production single-page application hosting with instant worldwide edge distribution (`smartfood-rescue-ai-25f38.web.app`). |
| **ML Model Pipeline** | Python 3.14 + `onnx` | `~1.17.0` | Scripted ONNX generation and graph export pipeline (`scripts/generate_spoilage_model.py`) compiling the `food_spoilage.onnx` runtime asset. |

### Architectural Design Decisions
1. **Hybrid Dual-Persistence Strategy (Local-First + Cloud Sync):** 
   - **Offline-First Resilience:** In live hackathon pitches, venue Wi-Fi drops can kill cloud-dependent apps. SmartFood Rescue AI runs pure deterministic TypeScript algorithms, client-side ONNX vision, and reactive state backed by browser `LocalStorage v2`, guaranteeing 100% functionality with zero latency even without internet access.
   - **Cloud Extensibility:** Pre-wired with Google Firebase (`src/services/firebase.ts`, `firestore.rules`, `functions/`) for real authentication, multi-device sync, Firestore batch streaming, and Cloud Functions backend automation.
2. **In-Browser Edge AI Vision:** Running the YOLOv8 computer vision classification model directly inside the browser using `onnxruntime-web` eliminates the latency, privacy concerns, and hosting costs of streaming webcam frames to external servers.
3. **Tailwind v4 Native CSS:** Zero-configuration CSS compilation using modern `@import "tailwindcss";` in `src/index.css` provides optimized bundle size, high performance, and rapid UI development.
4. **Hardware-Free Deterministic Simulation:** Physical IoT hardware in live hackathon venues frequently suffers from Wi-Fi drops, battery exhaustion, or calibration drift. Our Virtual IoT Simulator replicates multi-sensor telemetry mathematically while providing judges with interactive threshold controls (Normal, Warning, Danger) to test system resilience in real time.

---

## 📐 Mathematical Models & Decision Formulas

### 1. Demand Forecast Model: Rule-Based Forecasting Engine with Statistical Smoothing

The platform's demand forecasting module is engineered as a transparent, explainable **Rule-Based Forecasting Engine with Statistical Smoothing** utilizing moving averages and calibrated operational adjustments rather than an unconstrained black-box neural network:

$$\text{Raw Predicted Demand} = \text{Expected Attendance} \times 0.92$$

**Contextual Adjustments:**
- **Campus Event / Holiday:** $+8\%$ modifier
- **Special Feast Menu:** $+5\%$ modifier
- **Historical Smoothing:**
  $$\text{Predicted Demand} = \text{round}\Big(0.90 \times \text{Adjusted Raw} + 0.05 \times \text{PrevDay} + 0.05 \times \text{Avg7Day}\Big)$$

**Recommended Kitchen Preparation:**
$$\text{Recommended Preparation} = \text{round}\big(\text{Predicted Demand} \times 1.05\big)$$
*(Includes a $5\%$ calibrated safety buffer to avert meal deficits while curbing overproduction).*

> **Engineering Notice:** The current release uses an explainable, deterministic forecasting baseline based on expected attendance, event flags, previous-day demand, and seven-day average demand. In production, this baseline forms the robust fallback tier for our planned machine-learning regression pipeline.

**Canonical Demo Verification:**
- Expected Attendance: **320**
- No holiday / event, no special menu
- Previous Day Demand: **295**
- Seven-Day Average Demand: **295**
- **Result:** Predicted Demand = **295 meals**, Recommended Preparation = **310 meals**.

#### 🔮 Future ML Roadmap (Planned Scikit-Learn Regression Upgrade)

To evolve from heuristic smoothing into predictive supervised learning, the planned **scikit-learn** regression pipeline incorporates:

1. **Model Architecture:**
   - **GradientBoostingRegressor / RandomForestRegressor** (`scikit-learn`): Trained on multi-season cafeteria logs to model non-linear interactions between weather, academic milestones, and meal popularity.
   - **Feature Pipeline:**
     - Historical consumption lags: 1-day, 7-day, and 14-day rolling exponential moving averages ($\text{EMA}$).
     - Academic calendar encoders: Examination periods, weekend proximity, and semester phase indicators.
     - Meteorological covariates: Precipitation probability, ambient maximum heat index, and relative humidity.
     - Menu categorical embeddings: Heavy vs. light meal categories (e.g., Rice/Curry vs. Continental Breakfast).
2. **Serving & Edge Inference:**
   - Model serialized to **ONNX Runtime Web** (`onnxruntime-web`) for zero-latency in-browser evaluation directly within React without requiring external backend roundtrips.
   - **Hybrid Fallback Guarantee:** If weather APIs or historical tensors are unavailable, the system automatically falls back to the deterministic Rule-Based Smoothing Engine.

---

### 2. Edge Computer Vision Spoilage Detection (YOLOv8 ONNX)

To replace error-prone manual dropdowns with automated quality evaluation, SmartFood Rescue AI runs a computer vision classification model locally in the browser:

```
[Webcam Video Stream] 
       │ (Sampled every 2 seconds)
       ▼
[HTML5 Canvas: 224 x 224] 
       │ (Normalized Planar RGB Float32 Tensor: [1, 3, 224, 224])
       ▼
[onnxruntime-web: food_spoilage.onnx]
       │ (Softmax Output Probabilities)
       ├── Fresh: 0 pts deduction (Confidence: 94.2%)
       ├── Slightly Spoiled: -15 pts deduction (Confidence: 3.8%)
       └── Spoiled: -30 pts deduction (Confidence: 2.0%)
```

#### Tensor Specification & Inference Pipeline:
- **Model Path:** `/models/food_spoilage.onnx` (derived from YOLOv8 classification architecture).
- **Input Tensor:** Name `images`, Dimension `[1, 3, 224, 224]`, Datatype `float32` (RGB values normalized to $[0, 1]$).
- **Sampling Frequency:** Live webcam video frame captured every **2,000 ms** to an off-screen canvas.
- **Inference Execution:** `await session.run({ images: tensor })` via WebAssembly / WebGL backend.
- **Output Classes & Automatic Penalty Scoring:**
  - **Fresh ($0\text{ pts}$ deduction):** Normal surface texture and pristine appearance. Maps to `appearance = Normal`.
  - **Slightly Spoiled ($-15\text{ pts}$ deduction):** Initial oxidation, slight surface bruising, or minor moisture accumulation. Maps to `appearance = Suspicious` with $-15\text{ pts}$ calibrated deduction.
  - **Spoiled ($-30\text{ pts}$ deduction):** Severe discoloration, visible mold, or structural decomposition. Maps to `appearance = Suspicious` with $-30\text{ pts}$ deduction.
- **Human-in-the-Loop Override:** Kitchen staff can immediately review the model's classification, inspect the live confidence percentage badge, and manually override the assessment if necessary before final sign-off.

---

### 3. Quality-Risk Deduction Scoring Engine
Starting at a pristine baseline score of **$100$ points**:

$$\text{Final Score} = 100 - \sum \text{Deductions}$$

| Factor Checked | Violation Condition | Deduction Penalty |
| :--- | :--- | :---: |
| **Storage Temperature** | Temperature exceeds the prototype-configured storage threshold (default: 8°C) | **$-35\text{ pts}$** |
| **Redistribution Deadline** | Redistribution deadline passed (current time $>$ scheduled use-by window) | **$-40\text{ pts}$** |
| **Packaging Integrity** | Packaging damaged: broken seal, damaged container, or lid leakage | **$-25\text{ pts}$** |
| **AI Computer Vision Spoilage** | Real-time YOLOv8 ONNX spoilage detection: Slightly Spoiled / Spoiled | **$-15\text{ pts}$ to $-30\text{ pts}$** |
| **Sensory Appearance** | Human-entered visual or sensory concern: discoloration, abnormal texture, or odor concern | **$-30\text{ pts}$** |
| **Storage Environment** | Improper storage environment: uninsulated vessel or open ambient contamination | **$-20\text{ pts}$** |
| **Telemetry Gateway** | Virtual IoT device/sensor status offline | **$-10\text{ pts}$** |

**Classification Thresholds:**
- **$80 \le \text{Score} \le 100$**: **Safe for Human Review** (Eligible for NGO broadcast with authorised sign-off)
- **$50 \le \text{Score} \le 79$**: **Needs Manual Inspection** (Requires physical kitchen staff inspection)
- **$\text{Score} < 50$**: **Do Not Redistribute** (Flagged unsafe; disposal recommended)

> **Mandatory Disclaimer:** This AI-assisted quality indicator is a decision-support tool only. It does not certify food safety. Final approval for redistribution must be given by authorised kitchen staff or a qualified food-safety officer.

---

### 4. Multi-Criteria NGO Matching Algorithm
Matches eligible batches against active shelters in Vijayawada using a 100-point composite model:

$$\text{NGO Match Score (out of 100)} = S_{\text{dist}} + S_{\text{cap}} + S_{\text{cat}} + S_{\text{avail}}$$

1. **Distance Score ($35\%$ Weight, benchmark 12 km radius in Vijayawada):**
   $$S_{\text{dist}} = \max\left(0, 35 \times \left(1 - \frac{\text{Distance (km)}}{12}\right)\right)$$
2. **Capacity Score ($25\%$ Weight):**
   $$S_{\text{cap}} = 25 \times \min\left(1, \frac{\text{Available NGO Capacity}}{\text{Batch Surplus}}\right)$$
   *(If an NGO has insufficient capacity, the platform flags “Partial Capacity Available” and suggests splitting the batch between two NGOs rather than recommending it as a best match for a full batch).*
3. **Dietary Category Match ($20\%$ Weight):**
   $$S_{\text{cat}} = \begin{cases} 20 & \text{if recipient accepts food category (Cooked / Packaged / Raw)} \\ 0 & \text{if food category not accepted} \end{cases}$$
4. **Availability & Hours ($20\%$ Weight):**
   $$S_{\text{avail}} = \begin{cases} 20 & \text{if Available and within operating hours} \\ 8 & \text{if Busy but still potentially reachable} \\ 0 & \text{if Offline or Closed} \end{cases}$$

**Canonical Demo Verification (Hope Food Bank):**
- Location: Benz Circle, Vijayawada (Distance: $3.2\text{ km}$, Capacity: $25\text{ kg}$, Batch Surplus: $14\text{ kg}$, Category: Cooked Food, Status: Available)
- $S_{\text{dist}} = 35 \times (1 - 3.2 / 12) \approx 25.67$
- $S_{\text{cap}} = 25 \times \min(1, 25 / 14) = 25.00$
- $S_{\text{cat}} = 20.00$
- $S_{\text{avail}} = 20.00$
- Total $= 25.67 + 25 + 20 + 20 \approx 90.67 \rightarrow$ **Display rounded score = 91% match score**.

---

### 5. Time-Aware Route Planning & Safety Index

$$\text{Travel Time (minutes)} = \left(\frac{\text{Distance (km)}}{\text{Vehicle Speed (km/h)}}\right) \times 60 + \text{Handling Buffer (10 mins)}$$

- Default Vehicle: Three-Wheeler Auto ($20\text{ km/h}$)
- Distance: $3.2\text{ km}$
- Travel time: $(3.2 / 20) \times 60 + 10 = 9.6 + 10 = 19.6\text{ minutes} \approx \mathbf{20\text{ minutes}}$

> **Safe Wording Principle:** *Time-Aware Route Planning estimates delivery feasibility before the configured redistribution deadline.*

**Route Safety Labels:**
- **Safe:** expected arrival is comfortably before deadline.
- **At Risk:** expected arrival is close to deadline.
- **Deadline Missed:** expected arrival occurs after deadline.

---

### 6. Sustainability & ESG Impact Metrics

- **Meals Rescued:**
  $$\text{Meals Saved} = \frac{\text{Food Redistributed (kg)}}{0.25\text{ kg/meal}}$$
- **Estimated Economic Savings (₹):**
  $$\text{Estimated Cost Saved (₹)} = \text{Waste Avoided (kg)} \times ₹200/\text{kg}$$
- **Estimated Carbon Emissions Avoided:**
  $$\text{Estimated Carbon Avoided} = \text{Waste Avoided (kg)} \times 2.5\text{ kg CO}_2\text{e per kg}$$
- **Waste Prevention Rate:**
  $$\text{Prevention Rate (\%)} = \left(\frac{\text{Baseline Waste} - \text{Current Waste}}{\text{Baseline Waste}}\right) \times 100$$

*(Cost and carbon values are labelled as “Estimated” / “Prototype estimate” because they represent configurable institutional benchmarks, not verified institutional accounting records).*

**Canonical Completed-Delivery Scenario:**
- Food Redistributed: **14 kg** (Waste Avoided: 14 kg)
- Meals Saved: **56**
- Estimated Cost Saved: **₹2,800**
- Estimated Carbon Avoided: **35.0 kg CO₂e**

---

## 💻 Key Features & Application Pages

| Page / Module | Purpose & Core Capabilities |
| :--- | :--- |
| **1. Landing Page** | Public front page with problem workflow, 6-pillar solution, impact cards, institutional problem context, and interactive ROI savings calculator. |
| **2. Role Selection** | Quick entry point backed by **Firebase Authentication** (`signInAnonymously`) storing active profiles in Firestore `users/{uid}`, supporting 4 operational roles: *Kitchen Staff*, *NGO Partner*, *Delivery Partner*, *Administrator*. |
| **3. Operational Dashboard** | 8 primary KPI cards, **“Today’s Rescue Intelligence” AI card (`RescueInsightCard.tsx`)** powered by Claude/Gemini with live radar pulse, 5-stage live pipeline stepper, 4 Recharts graphs, and recent alerts. |
| **4. Demand Forecast** | Interactive calculator with attendance slider, meal category pickers, baseline rule checkboxes, risk badge, recommendation message, history table, and CSV export. |
| **5. Food Batches & Surplus** | Batch registration modal, automatic surplus calculation, deadline countdown, status badges, and quick links to quality checks and donation dispatch. |
| **6. Virtual IoT Simulator** | Software emulator with real-time temperature, humidity, weight, duration, 5 manual sliders, and 6 instant preset scenarios. |
| **7. Quality Check** | Circular score gauge (0–100), **Real-Time Edge Computer Vision Spoilage Camera (`QualityCamera.tsx`)** running YOLOv8 ONNX, confidence meter, deduction rule breakdown, reviewer notes, and human sign-off authorization gate. |
| **8. NGO Matching** | Ranked radar of 4 Vijayawada partners (Hope Food Bank, Seva Shelter, Helping Hands, Community Kitchen) with simulation of NGO accept/reject and fallback. |
| **9. Route Planning** | Map corridor interface, vehicle selector (Auto/Bike/Van), travel time calculator, manual corridor endpoints & distance entry with presets, 6-step dispatch timeline, and delivery photo proof. |
| **10. Sustainability Analytics** | 10 impact KPIs, 8 Recharts trend charts, UN SDG 12.3 alignment, and 1-click ESG CSV download. |
| **11. Audit Reports** | Executive printable compliance certificate with print stylesheet (Save as PDF) and itemized batch logs. |
| **12. Platform Settings** | Configurable canteen profile, thresholds, cost per kg, carbon factors, and 1-click **Load Vijayawada Demo Preset** button. |
| **13. Dataset Management** | Admin-exclusive ingestion console supporting CSV drag-and-drop, schema validation, duplicate audit, and synthetic benchmark warnings. |

---

## 🎨 Interactive Evaluator Tour & UI/UX Features

To deliver an exceptional evaluator experience during live demonstrations, SmartFood Rescue AI incorporates four interactive UI components:

1. **AI-Powered "Today's Rescue Intelligence" Card (`RescueInsightCard.tsx`):**
   - Embedded directly on the top of the Operational Dashboard.
   - Dispatches operational metrics (active surplus, top batch score, best NGO, deadline, rescued kg) to a serverless callable function executing Claude 3.5 / Gemini.
   - Features a pulsing green radar beacon, live streaming typewriter animation (20ms/char), and transparent Firestore daily caching with zero-latency local fallback.

2. **Real-Time Webcam Spoilage Detector (`QualityCamera.tsx`):**
   - Embedded directly inside the Quality Check page.
   - Accesses user webcam with sub-50ms canvas frame capture, runs edge inference via `onnxruntime-web`, and displays live classification tags (Fresh, Slightly Spoiled, Spoiled) with confidence percentages.
   - Automatically synchronizes deduction penalties into the master 100-point score while preserving manual override capabilities for kitchen inspectors.

3. **Guided Evaluator Demo Tour (`GuidedDemoTour.tsx`):**
   - Click the **"Guided Tour"** button in the navigation header or landing page to launch an automated 6-step walkthrough.
   - Progresses through: *Demand Forecasting $\rightarrow$ Surplus Batches $\rightarrow$ IoT Telemetry $\rightarrow$ Quality Decision Support $\rightarrow$ NGO Radar $\rightarrow$ Time-Aware Dispatch*.
   - Evaluators can step forward/backward or jump directly to any operational phase.

4. **Interactive ROI & Carbon Savings Calculator (`WasteSavingsCalculator.tsx`):**
   - Embedded directly on the public landing page.
   - Evaluators can drag daily meals cooked (100–3,000) and waste percentage (5%–35%) to instantly compute annual kilograms salvaged, financial savings (₹), and metric tons of $\text{CO}_2\text{e}$ mitigated.

5. **Live 5-Stage Pipeline Stepper (`PipelineStepper.tsx`):**
   - Prominently featured on the Operational Dashboard.
   - Dynamically tracks the active status of the 5-stage lifecycle (*1. Forecast $\rightarrow$ 2. Batch Logging $\rightarrow$ 3. IoT Quality Gate $\rightarrow$ 4. NGO Matching $\rightarrow$ 5. Time-Aware Dispatch*).

---

## 👥 Role-Based Access Control & Firebase Authentication

SmartFood Rescue AI implements a production-grade authentication and session management model using **Firebase Authentication** coupled with Firestore security profiles and offline fallback:

### Authentication Architecture
- **Auth Context (`src/context/AuthContext.tsx`):** Exposes `useAuth()` providing `{ user, role, loading, signInWithRole, signOut }` throughout the React component hierarchy.
- **Anonymous Session Initialization:** Clicking any role card on the Role Selection page calls `signInAnonymously(auth)`. Upon sign-in, the system writes or updates the user profile in Firestore:
  ```typescript
  // Write session state to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    role: selectedRole,
    name: 'Demo User',
    lastLogin: serverTimestamp(),
  }, { merge: true });
  ```
- **Real-Time Auth Observer (`onAuthStateChanged`):** Synchronizes the active user session, retrieves the persisted role from `users/{uid}`, and renders an emerald loading indicator while credentials resolve.
- **Offline-First Zero-Crash Fallback:** If the browser is offline or Firebase credentials are not supplied, `AuthContext` seamlessly falls back to local session state, allowing offline evaluation to continue uninterrupted.

### Role Responsibilities
1. **Kitchen Staff:**
   - Records food batches, runs forecasts, monitors alerts, and runs webcam spoilage checks.
   - Records authorised approval decisions according to institutional policy.
2. **NGO Partner:**
   - Receives surplus broadcast alerts in Vijayawada, reviews incoming food offers, and accepts/declines batches.
3. **Delivery Partner:**
   - Handles transit route corridors, vehicle assignment, step-by-step dispatch tracking, and delivery proof photo uploads.
4. **Administrator:**
   - Supervisory access to configure policy thresholds, review compliance certificates, manage datasets, and oversee audit logs.

---

## 📡 Virtual IoT Monitoring Simulator

> **Important Hackathon Constraint:** This project is **100% software-based** and requires no physical ESP32, Raspberry Pi, load cells, or physical hardware sensors.

The simulator provides:
- **Interactive Telemetry Sliders:** Real-time adjustment of Temperature (0–50°C), Relative Humidity (0–100%), Container Weight (0–50 kg), and Storage Duration (0–24 hrs).
- **6 One-Click Demonstration Scenarios:**
  1. **Simulate Normal Storage:** 5.0°C, 55% RH, Insulated Vessel, Online $\rightarrow$ *Simulated reading within prototype-configured 8°C threshold; human approval remains mandatory*.
  2. **Simulate High Temperature:** 28.0°C thermal abuse $\rightarrow$ *Warning: Temperature exceeds prototype-configured storage threshold*.
  3. **Simulate Expired Food:** Storage $> 8$ hours, deadline passed $\rightarrow$ *Critical Alert & Redistribution Blocked*.
  4. **Simulate Weight Reduction:** Dynamic delta in load scale readings.
  5. **Simulate Sensor Offline:** Emulates gateway disconnection $\rightarrow$ *Warning Penalty Applied*.
  6. **Reset Simulation:** Returns to default canonical readings.
- **Streaming Telemetry Table:** Timestamped readings log with status flags.

---

## ⚡ Serverless Cloud Functions & Backend Automation

The backend codebase (`functions/src/index.ts`) implements **6 serverless Cloud Functions** engineered for autonomous event-driven processing and scheduled compliance:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 FIREBASE CLOUD FUNCTIONS v7 (TypeScript)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. generateRescueInsight    │ Callable   │ Calls Claude 3.5 / Gemini to     │
│                             │            │ synthesize daily rescue brief.   │
├─────────────────────────────┼────────────┼──────────────────────────────────┤
│ 2. onBatchCreated           │ Firestore  │ Triggered on batches/{id}. Checks│
│                             │ Trigger    │ linked IoT temp against 8°C limit│
├─────────────────────────────┼────────────┼──────────────────────────────────┤
│ 3. onBatchStatusChanged     │ Firestore  │ Triggered on batches/{id} update.│
│                             │ Trigger    │ Emits NGO alert on 'Offered';    │
│                             │            │ Appends to esg_ledger on 'Deliv'.│
├─────────────────────────────┼────────────┼──────────────────────────────────┤
│ 4. onDeliveryCompleted      │ Callable   │ Commits audit trail record to    │
│                             │            │ audit_log and seals batch record.│
├─────────────────────────────┼────────────┼──────────────────────────────────┤
│ 5. weeklyESGDigest          │ Scheduled  │ Cron: 0 3 * * 1 (Mondays 3:00 AM)│
│                             │ Cron       │ Computes weekly ESG rollups.     │
├─────────────────────────────┼────────────┼──────────────────────────────────┤
│ 6. onIoTThresholdBreach     │ Firestore  │ Triggered on iot_readings/{id}.  │
│                             │ Trigger    │ Broadcasts urgent warning alerts.│
└─────────────────────────────┴────────────┴──────────────────────────────────┘
```

1. **`generateRescueInsight` (Callable Function):**
   - Accepts operational parameters (`activeBatches`, `topBatchScore`, `topBatchKg`, `bestNgoName`, `bestNgoMatch`, `deadlineMinutes`, `todayRescuedKg`).
   - Queries Anthropic Claude API (`claude-3-5-sonnet`) or Google Gemini with prompt calibrated for institutional coordinators.
   - Caches output daily in Firestore `insights/{YYYY-MM-DD}` to optimize API quotas.
2. **`onBatchCreated` (Firestore Document Created Trigger):**
   - Automatically monitors `batches/{batchId}` creation.
   - Cross-references linked IoT telemetry: if temperature exceeds 8°C, instantly sets `qualityStatus = 'Needs Manual Inspection'`.
3. **`onBatchStatusChanged` (Firestore Document Updated Trigger):**
   - Detects status changes in `batches/{batchId}`.
   - On transition to `'Offered'`: Creates a new document in `notifications/{timestamp}` targeting the matched NGO with surplus weight and pickup details.
   - On transition to `'Delivered'`: Computes ESG impact ($\text{meals} = \text{kg} \times 4$, $\text{CO}_2\text{e} = \text{kg} \times 2.5$) and appends an entry to the monthly ledger `esg_ledger/{YYYY-MM}`.
4. **`onDeliveryCompleted` (Callable Function):**
   - Receives delivery confirmation and writes an immutable audit record to `audit_log/{autoId}` containing batch ID, recipient NGO, handover timestamp, and delivery partner signature.
5. **`weeklyESGDigest` (Scheduled Cloud Cron Job):**
   - Executes weekly every Monday at 3:00 AM (`0 3 * * 1`).
   - Aggregates all deliveries from `esg_ledger`, sums total kilograms rescued and carbon avoided, and commits a signed executive summary to `reports/weekly_digest_{week}`.
6. **`onIoTThresholdBreach` (Firestore Document Created Trigger):**
   - Watches `iot_readings/{readingId}`.
   - If temperature $> 8^\circ\text{C}$ or humidity $> 80\%$, logs an emergency alert document in `alerts/{autoId}` to notify the on-duty kitchen staff immediately.

---

## 🎯 Canonical Hackathon Demo Scenario (Vijayawada)

| Parameter | Demonstration Value | Hackathon Context |
| :--- | :--- | :--- |
| **Facility** | Smart College Canteen | Near Kanaka Durga Varadhi, MG Road, Vijayawada |
| **Attendance Input** | **320 students & staff** | Thursday hostel and day-scholar lunch service |
| **Demand Forecast** | **295 meals** | $320 \times 0.92 = 294.4 \approx 295$ baseline prediction |
| **Kitchen Preparation** | **310 meals** | $295 \times 1.05 = 309.75 \approx 310$ (+5% safety buffer) |
| **Actual Meals Served** | **292 meals** | High forecast accuracy ($98.9\%$) |
| **Residual Surplus** | **18 meals (14.0 kg)** | Identified automatically upon service wrap-up |
| **Virtual IoT Status** | **5.2°C, 55% RH, Online** | Simulated reading within the prototype-configured 8°C threshold; human approval remains mandatory |
| **Quality Score** | **100 / 100** | Status: *Safe for Human Review* |
| **Best Match NGO** | **Hope Food Bank** | Benz Circle, Vijayawada (3.2 km, 25 kg cap, 91% match score) |
| **Transit Corridor** | **Three-Wheeler Auto** | 20 mins total travel & container handling time |
| **Delivery Status** | **Delivered ✓** | Completed with photo receipt confirmation |
| **Rescued Social Impact** | **56 meals saved** | $14.0\text{ kg} \div 0.25\text{ kg/meal}$ |
| **Estimated Financial Savings** | **₹2,800** | $14.0\text{ kg} \times ₹200/\text{kg}$ (Prototype estimate) |
| **Estimated Carbon Avoidance** | **35.0 kg CO₂e** | $14.0\text{ kg} \times 2.5\text{ kg CO}_2\text{e/kg}$ (Prototype estimate) |

---

## 📦 Kaggle Synthetic Dataset Integration & Ingestion Pipeline

To validate predictive models and decision formulas against large-scale operational benchmarks, SmartFood Rescue AI includes a safe, structured ingestion architecture for external datasets:

### Provenance & Benchmark Dataset
* **Dataset Name:** *AI-Powered Food Waste Management Dataset*
* **Source:** Kaggle
* **Data Nature:** Synthetic, business-logic-driven operational benchmark (~8,000 daily inventory records).
* **Provenance Record:** [`datasets/sources.md`](datasets/sources.md)
* **Standard Data Dictionary:** [`docs/DATA_DICTIONARY_TEMPLATE.md`](docs/DATA_DICTIONARY_TEMPLATE.md) (16 standardized operational fields mapped from raw columns).

### Downloadable CSV Templates
Pre-formatted CSV templates are located in `public/data/` for institutional import and testing:
1. `public/data/demand_forecast_template.csv` — Historical attendance and demand logs.
2. `public/data/food_batches_template.csv` — Kitchen production, residual weight, and use-by deadlines.
3. `public/data/quality_checks_template.csv` — Storage temperature, sensory inspection, and safety status.
4. `public/data/ngo_partners_template.csv` — Recipient shelter directory, capacity, and refrigeration availability.
5. `public/data/delivery_routes_template.csv` — Transit corridor distance, vehicle speeds, and handover timestamps.

### Dataset Management Admin Console
Accessible exclusively to users in the **Administrator** role (`/dataset-management`):
* **Drag-and-Drop Ingestion:** Supports instant upload of CSV files directly in the browser.
* **Automated Audit:** Scans for missing required fields, negative quantities, duplicate record IDs, and invalid categories.
* **Synthetic Benchmark Notice:** Clearly labels synthetic data to ensure scientific transparency.
* **Staged Preview Modal:** Allows administrators to preview valid rows and error records before committing changes to localStorage.

---

## 📑 SIH 2026 Presentation Deck & Visual Assets

SmartFood Rescue AI includes a comprehensive, ready-to-present pitch deck modeled after official Smart India Hackathon guidelines:

* **Complete 6-Slide Presentation Contract:** [`docs/SIH_2026_PRESENTATION_DECK.md`](docs/SIH_2026_PRESENTATION_DECK.md)
  * *Slide 1:* Basic Details & Team Annadata AI Identity.
  * *Slide 2:* Problem, 5-Stage Solution Pipeline & Unique Value Proposition (UVP).
  * *Slide 3:* Technical Architecture, Intelligence Layer & 8-Step Process Flow.
  * *Slide 4:* 4-Pillar Feasibility, Risk Mitigation Matrix & 4-Phase Roadmap.
  * *Slide 5:* Quantifiable Impact (65% waste drop, 3.5x speedup), ESG & SDG Alignment.
  * *Slide 6:* Research References, FSSAI Legal Compliance & Live Prototype Links.

* **High-Resolution Generated Graphics:** Available in [`docs/images/`](docs/images/) and [`public/images/`](public/images/):
  1. `system_ecosystem_3d.jpg` — 3D isometric ecosystem infographic (Slide 2/3).
  2. `batch_iot_monitor.jpg` — IoT insulated thermal batch monitor at 65°C (Slide 2/4).
  3. `handover_proof_ngo.jpg` — Verified delivery handover to Vijayawada community shelter (Slide 4/5).
  4. Visual Asset Placement Guide: [`docs/PPT_VISUAL_ASSETS.md`](docs/PPT_VISUAL_ASSETS.md).

---

## 📸 Application Screenshots

> Add application screenshots after running or deploying the project.

| Landing Page | Dashboard |
|---|---|
| ![Landing Page](docs/screenshots/landing-page.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Demand Forecast | NGO Matching |
|---|---|
| ![Demand Forecast](docs/screenshots/demand-forecast.png) | ![NGO Matching](docs/screenshots/ngo-matching.png) |

| Quality Check | Sustainability Analytics |
|---|---|
| ![Quality Check](docs/screenshots/quality-check.png) | ![Analytics](docs/screenshots/sustainability.png) |

---

## ⚡ Quick Start & Comprehensive Installation Guide

### System Prerequisites
Ensure your local development environment meets the following specifications before installation:
- **Node.js**: `v18.20.0+`, `v20.x`, or `v22.x` (LTS versions strongly recommended). Check via `node -v`.
- **Package Manager**: `npm` (v9+ or v10+ included with Node.js), `pnpm` (v8+), or `yarn` (v1.22+). Check via `npm -v`.
- **Version Control**: `git` (v2.30+). Check via `git --version`.
- **Web Browser**: Any modern evergreen browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari) with JavaScript and LocalStorage enabled.

---

### Step-by-Step Installation

#### 1. Clone the Repository
Clone the project from GitHub to your local machine:
```bash
git clone https://github.com/mahammedsathyala/SmartFood-Rescue-AI_SIH_2026.git
cd SmartFood-Rescue-AI_SIH_2026
```

#### 2. Install Dependencies
Install all required runtime and development packages:
```bash
# Using standard npm (recommended)
npm install

# Alternatively using pnpm or yarn
# pnpm install
# yarn install
```

#### 3. Start the Local Development Server
Launch Vite's development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Once the dev server compiles, open your web browser and navigate to:
```text
http://localhost:5173/
```
The application will automatically load with the canonical **Vijayawada Pilot** seed dataset pre-populated in your browser's `LocalStorage`.

#### 4. Verify Static Code Quality & Linter
Run the static code analysis suite to verify code health:
```bash
npm run lint
```
*Expected output: Clean exit with zero errors or warnings.*

#### 5. Compile for Production & Typecheck
Execute a full TypeScript build and bundle compilation:
```bash
npm run build
```
This runs `tsc -b` to validate strict type definitions followed by Vite compiling production-optimized HTML, CSS, and JS bundles into the `/dist` directory.

#### 6. Preview the Production Bundle Locally
Test the compiled production bundle under realistic serving conditions:
```bash
npm run preview
```
Vite will serve the `/dist` folder locally at `http://localhost:4173/`.

---

### NPM Scripts Reference Table

| Script Command | Underlying Execution | Description & Purpose |
|:---|:---|:---|
| `npm run dev` | `vite` | Starts the fast local development server on port 5173 with instant Hot Module Replacement. |
| `npm run build` | `tsc -b && vite build` | Performs strict whole-project TypeScript typechecking and compiles minified production assets into `/dist`. |
| `npm run lint` | `oxlint` | Runs the high-performance Oxlint linter across all `.ts` and `.tsx` files in the repository. |
| `npm run preview` | `vite preview` | Boots a lightweight local HTTP server to preview and test the built production distribution. |
| `npx firebase deploy --only hosting` | `firebase deploy` | Deploys the compiled `/dist` single-page application to Firebase Hosting edge CDN. |
| `npx firebase deploy` | `firebase deploy` | Deploys all services (Hosting, Firestore rules, and Cloud Functions) simultaneously. |
| `npm --prefix functions run build` | `tsc` | Compiles serverless TypeScript Cloud Functions in `/functions`. |

---

### Environment & Cloud Configuration

SmartFood Rescue AI is engineered for both **plug-and-play zero-config offline usage** and **cloud-ready production deployment**:
- **Offline / Zero-Config by Default:** All core algorithms, simulations, route planning, and ESG reporting operate out-of-the-box without requiring external API keys. Data persists seamlessly in browser `LocalStorage v2`.
- **Firebase Cloud Services (.env):** When connecting to live Firebase Cloud Firestore, Authentication, or Storage, credentials are automatically loaded from `.env` (with a `.env.example` template provided):
  ```bash
  VITE_FIREBASE_API_KEY=AIzaSyC7VchI...
  VITE_FIREBASE_AUTH_DOMAIN=smartfood-rescue-ai.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=smartfood-rescue-ai
  VITE_FIREBASE_STORAGE_BUCKET=smartfood-rescue-ai.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=86396956859
  VITE_FIREBASE_APP_ID=1:86396956859:web:daa396f63a353ce132b99e
  VITE_FIREBASE_MEASUREMENT_ID=G-WBWCX7W49D
  ```
- **Live Deployment:** The production build is hosted live at [https://smartfood-rescue-ai-25f38.web.app](https://smartfood-rescue-ai-25f38.web.app).

---

### 🗺️ Maps Integration

SmartFood Rescue AI implements a secure, resilient dual-mode route visualization system:

- **Google Maps Demo Key (`VITE_GOOGLE_MAPS_DEMO_KEY`):**
  - Optional client-side environment variable (`.env.local`).
  - Used strictly in the React frontend to render an interactive Google Map with origin (Smart College Canteen) and destination (Hope Food Bank, Benz Circle) markers and route polylines for testing and prototyping.
  - Displays: `“Google Maps Demo Integration — testing/prototyping only.”`
- **Route Simulation Mode (Zero-Crash Fallback):**
  - If no demo key is configured, or if the key is missing, invalid, expired, or unavailable, the application operates in **Route Simulation Mode**.
  - Renders a clean animated transit corridor simulation without crashing or depending on external APIs.
  - Displays: `“Map Simulation Mode — Google Maps demo key is unavailable.”`
- **Secure Server Routes Key (`GOOGLE_MAPS_SERVER_ROUTES_KEY`):**
  - The production Google Routes Server Key is **never exposed to the browser, Vite client code, or public bundles**.
  - Stored only in backend environments (`backend/.env.example`).
  - Reserved for future secure backend execution (FastAPI/Node.js via `POST /api/routes/estimate`) where the backend queries the Google Routes API securely and streams sanitized metrics to the client.

---

### Troubleshooting & FAQ

<details>
<summary><strong>Q1: Port 5173 is already in use by another application.</strong></summary>

You can specify an alternative port directly via the command line:
```bash
npm run dev -- --port 3000 --open
```
Vite will start the server on port 3000 and automatically open your default browser.
</details>

<details>
<summary><strong>Q2: Stale data or unexpected state in browser session.</strong></summary>

If you previously tested another build, navigate to the **Settings** page within the app and click **"Reset Demo Data"**, or run the following in your browser's Developer Tools Console (`F12`):
```javascript
localStorage.clear();
location.reload();
```
The app will immediately re-seed all canonical Vijayawada baseline records (`sfr_batches_v2`, `sfr_forecasts_v2`, etc.).
</details>

<details>
<summary><strong>Q3: Windows PowerShell execution policy error running npm.</strong></summary>

If Windows PowerShell displays `File ... cannot be loaded because running scripts is disabled on this system`, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then re-run `npm run dev`.
</details>

<details>
<summary><strong>Q4: Node.js version incompatibility.</strong></summary>

If you see errors regarding unsupported syntax or modern JavaScript features, verify your active Node.js version with `node -v`. If you are using `nvm` (Node Version Manager), switch to an active LTS release:
```bash
nvm use 20
npm install
npm run dev
```
</details>

---

## 📂 Project Directory Structure

```
SmartFood-Rescue-AI_SIH_2026/
├── LICENSE                      # MIT License (Team Annadata AI)
├── README.md                    # Comprehensive project documentation
├── package.json                 # Project dependencies & scripts (React 19, Vite 8, TS 6, ONNX Runtime)
├── tsconfig.json                # Root TypeScript configuration
├── tsconfig.app.json            # Application TypeScript settings
├── vite.config.ts               # Vite configuration with React & Tailwind plugins
├── .env.example                 # Template for Firebase credentials & environment keys
├── .firebaserc                  # Firebase project routing (smartfood-rescue-ai)
├── firebase.json                # Firebase Hosting (dist/), Firestore & Functions routing
├── firestore.rules              # Cloud Firestore security rules with RBAC policies
├── firestore.indexes.json       # Cloud Firestore query index definitions
├── backend/                     # Future-ready secure backend architecture
│   ├── .env.example             # Secret GOOGLE_MAPS_SERVER_ROUTES_KEY template
│   └── README.md                # Server Routes API & POST /api/routes/estimate docs
├── public/
│   ├── data/                    # CSV templates for Kaggle dataset ingestion
│   ├── images/                  # Infographics and 3D ecosystem visual assets
│   └── models/
│       └── food_spoilage.onnx   # Edge YOLOv8 food spoilage ONNX model (Fresh/Mild/Spoiled)
├── scripts/
│   └── generate_spoilage_model.py # Python ONNX model generator script
├── docs/
│   ├── screenshots/             # Visual UI walkthrough artifacts
│   ├── DATA_DICTIONARY_TEMPLATE.md
│   ├── PPT_VISUAL_ASSETS.md
│   └── SIH_2026_PRESENTATION_DECK.md
├── functions/                   # Serverless Firebase Cloud Functions codebase
│   ├── src/index.ts             # 6 Functions: GenAI brief, IoT audit, NGO alert, ESG ledger
│   ├── package.json             # Functions dependencies (@anthropic-ai/sdk, firebase-admin)
│   └── tsconfig.json            # TypeScript build configuration for functions
├── src/
│   ├── main.tsx                 # React DOM bootstrapping
│   ├── App.tsx                  # Master shell, AuthContext provider & state coordinator
│   ├── index.css                # Tailwind CSS v4 imports & custom styles
│   ├── types/
│   │   └── index.ts             # Domain models (Batch, Forecast, IoT, NGO, Route, ESG)
│   ├── context/
│   │   └── AuthContext.tsx      # Firebase Auth session state & role context hook (useAuth)
│   ├── services/
│   │   ├── firebase.ts          # Firebase SDK client initialization (Auth, DB, Functions)
│   │   ├── mockData.ts          # Seed data for Vijayawada canonical scenario
│   │   └── storage.ts           # LocalStorage service, math formulas & insight aggregator
│   ├── components/
│   │   ├── Navbar.tsx           # Top header with role switcher, notifications, date
│   │   ├── Sidebar.tsx          # Collapsible/mobile-responsive navigation sidebar
│   │   ├── RescueInsightCard.tsx# AI GenAI card with pulsing radar & 20ms typewriter effect
│   │   ├── QualityCamera.tsx    # Live webcam food spoilage detector via onnxruntime-web
│   │   ├── PipelineStepper.tsx  # Live 5-stage lifecycle progress tracker
│   │   ├── WasteSavingsCalculator.tsx # Interactive public ROI & carbon savings calculator
│   │   ├── GuidedDemoTour.tsx   # Interactive 6-step guided walkthrough modal
│   │   ├── GoogleRouteMap.tsx   # Dual-mode Google Maps & Corridor Simulation component
│   │   ├── DisclaimerBanner.tsx # Software simulation & food safety disclaimers
│   │   ├── ConfirmationModal.tsx# Reusable modal for alerts and data resets
│   │   └── Toast.tsx            # Animated notification alert container
│   └── pages/
│       ├── LandingPage.tsx          # Public presentation & problem-solution page
│       ├── RoleSelectionPage.tsx    # Firebase Auth 4-role login & workspace selector
│       ├── DashboardPage.tsx        # 8 KPI cards, AI insight card, Recharts charts, alerts
│       ├── DemandForecastPage.tsx   # Pre-cooking demand predictor with CSV export
│       ├── FoodBatchesPage.tsx      # Batch tracking, surplus calculation & status flows
│       ├── IoTSimulatorPage.tsx     # Virtual IoT emulator with sliders & 6 presets
│       ├── QualityCheckPage.tsx     # ONNX webcam detector, score gauge & deduction breakdown
│       ├── NgoMatchingPage.tsx      # Multi-criteria Vijayawada partner matching radar
│       ├── RoutePlanningPage.tsx    # Transit corridor map, vehicle matrix & 6-step state
│       ├── SustainabilityPage.tsx   # ESG metrics, 10 KPIs, 8 charts & CSV export
│       ├── ReportsPage.tsx          # Executive printable compliance certificate
│       ├── DatasetManagementPage.tsx# Admin Kaggle synthetic dataset ingestion console
│       └── SettingsPage.tsx         # Platform parameter tuning & defaults reset
```

---

## 🎬 Judge / Evaluator Walkthrough Script

Follow this 5-minute flow to demonstrate the entire ecosystem during evaluation:

1. **Landing Page:**
   - Point out the tagline: *“Predict. Rescue. Redistribute. Measure.”*
   - Review the 5-step problem workflow and 6 solution pillars.
   - Test the interactive **Waste Savings Calculator** slider.
   - Click **“Get Started (Choose Role)”**.
2. **Role Selection Page (Real Firebase Authentication):**
   - Show the 4 available operational roles (*Kitchen Staff*, *NGO Partner*, *Delivery Partner*, *Administrator*).
   - Click **“Continue as Kitchen Staff”** to trigger Firebase `signInAnonymously(auth)` and establish session state in Firestore `users/{uid}`.
3. **Operational Dashboard & AI Rescue Intelligence:**
   - Highlight the **“Today’s Rescue Intelligence” AI card (`RescueInsightCard.tsx`)** at the top:
     - Point out the pulsing green radar beacon.
     - Note the streaming typewriter animation summarizing current surplus urgency, nearest NGO, and delivery deadlines via Claude 3.5 / Gemini.
   - Highlight the **8 KPI Cards** matching the canonical scenario: 295 predicted meals, 310 prepared, 14 kg surplus, 56 meals saved, estimated ₹2,800 saved, estimated 35 kg $\text{CO}_2\text{e}$ avoided.
   - Point out the 4 Recharts charts (7-day waste drop, prep vs served).
4. **Demand Forecast:**
   - In the sidebar, click **Demand Forecast**.
   - Note the transparent engineering prototype banner explaining the baseline model and production ML pathway.
   - Click **“Load Demo Scenario”** (Expected attendance 320, Previous 295, 7-day Avg 295 $\rightarrow$ Predicted 295 meals $\rightarrow$ Recommended prep 310 meals).
   - Show the history table and the 1-click **Export CSV** button.
5. **Virtual IoT Simulator:**
   - In the sidebar, click **Virtual IoT Simulator**.
   - Note the visible software simulation notice banner.
   - Click **“Simulate High Temperature (28°C)”** to see the system turn into an amber/red warning state (triggers serverless alert condition).
   - Click **“Simulate Normal Storage”** to observe the system recover to optimal storage (5°C) within threshold.
6. **Quality Check & Edge Computer Vision Spoilage Detection:**
   - In the sidebar, click **Quality Check**.
   - Demonstrate the **Live Webcam Spoilage Detector (`QualityCamera.tsx`)**:
     - Point webcam toward food or a sample object.
     - Observe live frame sampling every 2 seconds and edge inference execution via `onnxruntime-web` (`/models/food_spoilage.onnx`).
     - Point out the real-time classification tag (**Fresh 0pts**, **Slightly Spoiled -15pts**, or **Spoiled -30pts**) and confidence score percentage.
     - Observe the automatic deduction dynamically applied to the circular score gauge.
     - Highlight the human-in-the-loop manual override dropdown.
   - Click **“Approve for Donation”** with authorised role verification.
7. **NGO Matching Radar:**
   - In the sidebar, click **NGO Matching**.
   - Point out **Hope Food Bank** ranked #1 (Benz Circle, 3.2 km, 25 kg capacity, **91% match score**).
   - Note that if an NGO has insufficient capacity, the system displays "Partial Capacity Available" and suggests splitting the batch.
   - Click **“Simulate NGO Accept”** or test **“Simulate NGO Reject”** to show instant AI fallback to the next best partner (*Seva Shelter Home*).
   - Point out the background Cloud Function trigger (`onBatchStatusChanged`) broadcasting the donation offer notification.
8. **Route Planning & Delivery:**
   - In the sidebar, click **Route Planning**.
   - View the simulated transit corridor between College Canteen and Hope Food Bank (3.2 km, 20 minutes total via Auto).
   - Toggle vehicle type between *Auto*, *Bike*, and *Van* to see travel time recalculations.
   - Walk through the 6-step timeline and click **“6. Mark Delivered ✓”** to trigger delivery completion confetti.
   - Highlight the backend trigger appending immutable ESG metrics to `esg_ledger` and logging to `audit_log`.
9. **Sustainability Analytics & Reports:**
   - In the sidebar, view **Sustainability Analytics** to see dynamically calculated ESG figures (56 meals saved, estimated ₹2,800 saved, estimated 35 kg $\text{CO}_2\text{e}$ avoided).
   - Click **Reports** and then **“Print / Save as PDF”** to demonstrate institutional compliance certification generation.

---

## ⚖️ Compliance & Ethical Disclaimers

1. **Software-Only Prototype:**  
   This prototype uses simulated virtual IoT data. In production deployment, the platform connects to physical temperature probes, load cells, smart cold-storage units, and existing kitchen management APIs.
2. **Food Safety & Ethical Redistribution Notice:**  
   The AI quality indicator is an operational decision-support tool only. It does not certify legal food safety under regulatory statutes. Formal redistribution sign-offs must be approved by authorised kitchen staff or certified food-safety officers.
3. **Data Privacy & NGO Contacts:**  
   All contact names, addresses, and phone numbers shown are mock demonstration data for the Vijayawada pilot scenario. No live financial payments or personal beneficiary identities are collected.

---

## 🔮 Future Production Roadmap

- [x] **Edge Computer Vision Spoilage Detection:** Implemented in-browser YOLOv8 ONNX classification via `onnxruntime-web` with real-time webcam frame sampling.
- [x] **Generative AI Rescue Intelligence:** Implemented operational briefing agent powered by Claude 3.5 / Gemini via Cloud Functions with Firestore daily caching.
- [x] **Production Firebase Authentication:** Implemented anonymous demo sessions and persistent Firestore `users/{uid}` role synchronization with offline fallback.
- [x] **Serverless Event-Driven Architecture:** Implemented 6 Cloud Functions triggers for IoT threshold audits, NGO alerts, delivery confirmations, and weekly ESG digest crons.
- [ ] **Physical Hardware Connectors:** Plug-and-play firmware drivers for ESP32 and LoRaWAN long-range temperature and humidity probes.
- [ ] **Government FSSAI & Food Bank API Integration:** Direct digital compliance filings with national food-safety and redistribution authorities.
- [ ] **Multi-Facility Aggregator:** Centralized dashboard for city-wide university clusters and district-level food banks across Andhra Pradesh.

---

## 👨‍💻 Team & Attribution

- **Team Name:** Annadata AI
- **Project:** SmartFood Rescue AI
- **Theme:** AI-Powered Food Waste Reduction & Sustainable Redistribution
- **Lead Developer:** [Mahammed Sathyala](https://github.com/mahammedsathyala)
- **Repository:** [https://github.com/mahammedsathyala/SmartFood-Rescue-AI_SIH_2026](https://github.com/mahammedsathyala/SmartFood-Rescue-AI_SIH_2026)

---
*Built with ❤️ for a Zero-Waste, Sustainable India.*
