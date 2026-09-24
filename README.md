# SmartFood Rescue AI
> **Tagline:** *“Predict. Rescue. Redistribute. Measure.”*  
> **Smart India Hackathon Software Project:** Problem Statement **SIH26234**  
> **Title:** *AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem for Institutional Kitchens and Food Processing Units*  
> **Demonstration City:** Vijayawada, Andhra Pradesh  

---

## 📌 Project Context & Overview

Institutional kitchens (college canteens, hostels, cafeterias, large caterers, and food processing units) face immense unpredictability in daily attendance, leading to 15–25% food overproduction. Unconsumed nutritious meals are routinely discarded into municipal landfills, exacerbating methane greenhouse gas emissions and financial losses.

**SmartFood Rescue AI** is a complete, software-first solution that closes the loop between **pre-cooking demand prediction**, **surplus detection**, **IoT cold-chain quality assessment**, **vetted NGO matching**, **time-critical route dispatch**, and **ESG sustainability accounting**.

### 💡 Software-First Implementation
This prototype operates with **zero external hardware dependencies**. It features a built-in **Virtual IoT Monitoring Simulator** that simulates digital temperature probes, electronic load scales, and smart pantry storage units in real time.

---

## 🚀 Key Functional Modules

1. **AI Demand Forecasting Engine**
   - Predicts meal requirements before cooking using attendance counts, day-of-week patterns, holidays (+8%), special feast menus (+5%), and historical moving averages.
   - Computes recommended prep quantities with a +5% safety buffer to eliminate overproduction risk.

2. **Food Batches & Surplus Detection**
   - Automatically computes residual meal counts and surplus weight (kg).
   - Manages state machine: `No Surplus` → `Surplus Detected` → `Offered` → `Accepted` → `Delivered` / `Expired`.

3. **Virtual IoT Monitoring Simulator**
   - Real-time simulation of Temperature (°C), Humidity (%), Container Weight (kg), and Gateway Connectivity.
   - Interactive sliders and 6 preset simulation scenarios: *Normal Storage (5°C)*, *High Temperature (28°C)*, *Expired Food*, *Weight Reduction*, *Sensor Offline*, and *Reset*.

4. **Quality Check & Decision Support**
   - Automated rule deduction engine starting at 100 points:
     - Unsafe temperature (>8°C): -35 pts
     - Redistribution deadline expired: -40 pts
     - Damaged packaging: -25 pts
     - Suspicious appearance / aroma: -30 pts
     - Improper storage: -20 pts
     - Sensor offline: -10 pts
   - Formal sign-off gate restricted to authorized Kitchen Staff and Administrators.

5. **Nearby NGO Matching (Vijayawada Radar)**
   - Vetted partner organizations: *Hope Food Bank (Benz Circle)*, *Seva Shelter Home (Patamata)*, *Helping Hands Foundation (Moghalrajpuram)*, *Community Kitchen Network (Auto Nagar)*.
   - Multi-criteria weighted ranking: Distance (35%), Capacity (25%), Dietary Category (20%), Availability (20%).
   - Simulation of NGO accept/reject with instant fallback recommendation.

6. **Pickup & Delivery Route Planning**
   - Simulated SVG transit corridor map for Vijayawada.
   - Vehicle selector: Three-Wheeler Auto, Bike, Cargo Van, Refrigerated Van.
   - Travel time formula: `travelTimeMinutes = (distanceKm / 20) * 60 + 10`.
   - 6-step dispatch state machine with delivery proof photo and completion celebration.

7. **Sustainability & ESG Analytics**
   - Transparent impact calculations:
     - Meals Saved = `foodRedistributedKg / 0.25`
     - Cost Saved = `wasteAvoidedKg * ₹200`
     - Carbon Avoided = `wasteAvoidedKg * 2.5 kg CO₂e`
     - Waste Prevention Rate = `((baseline - current) / baseline) * 100`
   - 10 KPI cards and 8 Recharts analytics graphs.

8. **Institutional Audit & Impact Reports**
   - Filter by date range, kitchen hub, food category, NGO, and donation status.
   - Printable verification certificate with customized print styles and 1-click **Export CSV**.

9. **Role-Based Workspaces**
   - Seamless role switching: **Kitchen Staff**, **NGO Partner**, **Delivery Partner**, and **Administrator**.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + TypeScript
- **Bundler & Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 + Custom Sustainability Design Tokens
- **Charts:** Recharts
- **Icons:** Lucide React
- **Celebrations:** Canvas Confetti
- **State & Data Persistence:** LocalStorage (zero backend/API setup needed)

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mahammedsathyala/SmartFood-Rescue-AI_SIH_2026.git

# Navigate to the project directory
cd SmartFood-Rescue-AI_SIH_2026

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏢 Canonical Demonstration Scenario (Vijayawada)

| Parameter | Demo Value |
| :--- | :--- |
| **Kitchen Hub** | Smart College Canteen, MG Road, Vijayawada |
| **Expected Attendance** | 320 students & staff |
| **Menu Item** | Vegetable Rice & Sambar |
| **AI Predicted Demand** | 295 meals |
| **Recommended Prep** | 310 meals (+5% buffer) |
| **Actual Cooked / Served** | 310 prepared / 292 served |
| **Identified Surplus** | 18 meals (14.0 kg) |
| **Virtual IoT Telemetry** | 5.2°C, 55% RH, Insulated Vessel, Online |
| **Quality Assessment** | 92 / 100 (*Safe for Human Review*) |
| **Matched Recipient** | Hope Food Bank, Benz Circle (3.2 km, 25 kg cap) |
| **Logistics** | Three-Wheeler Auto (AP 16 TX 4920) • 20 mins transit |
| **Impact Generated** | **56 meals saved** • **₹2,800 saved** • **35 kg CO₂e mitigated** |

---

## 📜 Compliance & Disclaimers

- **Software Simulation:** All IoT sensor parameters (temperature, humidity, scale weight) are generated virtually for software evaluation purposes. In real deployment, the platform connects to physical cold-chain IoT gateways and smart weighing scales.
- **Food Safety:** The AI quality indicator serves as a decision-support guide only. Final redistribution approvals must be signed off by authorized personnel.
