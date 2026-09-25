# Datasets Registry & Source Provenance

This document tracks all external, synthetic, and demonstration data assets used within the **SmartFood Rescue AI** project.

---

## 1. AI-Powered Food Waste Management Dataset

- **Dataset Name:** AI-Powered Food Waste Management Dataset
- **Source:** Kaggle (`Kaggle Public Dataset Community`)
- **Direct Kaggle URL:** *[Placeholder: Add exact Kaggle URL upon dataset verification, e.g., https://www.kaggle.com/datasets/...]*
- **Download / Ingestion Date:** *[Placeholder: YYYY-MM-DD]*
- **Record Count:** ~8,000 daily inventory & operational logs
- **Files Included:**
  - `food_waste_dataset.csv`
  - `data_dictionary.csv`
  - `README.md`
- **Data Type:** Synthetic, business-logic-driven operational data
- **Domain Coverage:**
  - Inventory tracking and shelf-life monitoring
  - Pre-preparation demand and sales variance
  - Storage temperature and ambient condition telemetry
  - Expiry and remaining stock logging
  - Post-service food surplus and donation routing

### 🎯 Intended Use
1. **Educational Prototype:** Supporting the Smart India Hackathon (SIH) prototype demonstration.
2. **Model Development & Testing:** Feature engineering, demand regression experimentation, and time-to-spoilage decision boundaries.
3. **Workflow Validation:** Validating cold-chain quality-threshold gates and multi-criteria redistribution ranking algorithms.

---

## ⚠️ Important Limitations & Ethical Disclosure

> [!WARNING]
> **Synthetic Data Disclaimer:**
> - This dataset is **synthetic** and generated via algorithmic/business rules.
> - It is **NOT** real operational data from Vijayawada, Smart College Canteen, local institutional hostels, partner NGOs, or food recipients.
> - It must **NOT** be represented as certified biological food safety observations or validated municipal kitchen measurements.
> - The live SmartFood Rescue AI client keeps raw dataset files isolated in `datasets/raw/` to ensure frontend bundle performance and data integrity.

---

## 2. Dataset Management Policy

| Layer | Location | Status | Bundle Inclusion |
| :--- | :--- | :--- | :--- |
| **Raw Kaggle Files** | `datasets/raw/ai_powered_food_waste_management/` | Isolated raw data | ❌ Excluded from build |
| **Processed Subsets** | `datasets/processed/` | Sanitized & mapped extracts | ❌ Excluded from build |
| **Public CSV Templates** | `public/data/` | Standardized schemas & samples | ✅ Public static download |
| **App Demo Data** | `src/services/mockData.ts` & LocalStorage | Clean canonical demo state | ✅ In-memory fallback |
