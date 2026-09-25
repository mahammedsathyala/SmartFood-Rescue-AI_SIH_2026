# Data Dictionary & Schema Mapping Template

This document provides both the **Standard Schema Mapping Template** and the **Exact Mappings** for the public synthetic Kaggle *AI-Powered Food Waste Management Dataset* integrated into the **SmartFood Rescue AI** environment.

---

## 📋 Kaggle Dataset: Exact Field Specifications & Target Mappings

Based on the official Kaggle dataset files (`food_waste_dataset.csv` and `data_dictionary.csv`, ~8,000 records):

| # | Original Column Name | Inferred Data Type | Description | Missing Value (%) | Target SmartFood Field | Consuming Module | Data Quality / Cleaning Notes |
| :-: | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **01** | `Inventory_ID` | `String` | Unique daily inventory record ID (e.g. `INV000001`) | `0.0% (None)` | `FoodBatch.id` | Food Batches / Audit | Formatted as alphanumeric unique ID |
| **02** | `Date` | `Date (YYYY-MM-DD)` | Calendar date spanning full synthetic year | `0.0% (None)` | `DemandForecastRecord.date` / `FoodBatch.prepDateTime` | Demand Forecast & Reports | Maps to operational calendar logs |
| **03** | `Business_Type` | `Categorical` | `Restaurant`, `Supermarket`, `Cafeteria`, `Cloud Kitchen` | `0.0% (None)` | Context filter / `Settings.kitchenName` | Multi-Facility Routing | Cafeteria & Restaurant records prioritize college canteen mapping |
| **04** | `Food_Category` | `Categorical` | `Fruits`, `Vegetables`, `Dairy`, `Bakery`, `Meat`, `Prepared Food` | `0.0% (None)` | `FoodBatch.category` | Food Batches & Forecast | Maps into SmartFood categories (`Rice`, `Curry`, `Breakfast`, `Snacks`, `Other`) |
| **05** | `Purchase_Quantity` | `Integer` | Total units purchased / stocked for the day | `0.0% (None)` | `FoodBatch.mealsPrepared` / `preparedKg` | Kitchen Preparation | Standard baseline prep volume |
| **06** | `Units_Sold` | `Integer` | Total units consumed/sold (`<= Purchase_Quantity`) | `0.0% (None)` | `FoodBatch.mealsServed` / `servedKg` | Operational Dashboard | Correlates with student meal attendance |
| **07** | `Remaining_Stock` | `Integer` | Units left after meal service (`Purchase - Sold`) | `0.0% (None)` | Raw residual inventory | Inventory Audit | Pre-surplus detection baseline |
| **08** | `Shelf_Life_Days` | `Float` | Safe consumption window before expiry | `~2.9%` | `FoodBatch.deadlineDateTime` | Surplus Tracking | Hot cooked items convert to hours (4–6h) |
| **09** | `Storage_Temperature` | `Float` | Storage temperature in degrees Celsius (°C) | `~2.3%` | `VirtualIoTSensorData.temperature` | IoT Simulator / Quality | Cold storage `< 5°C`, hot-holding `> 60°C` |
| **10** | `Daily_Demand` | `Float` | Realized or estimated customer demand units | `~2.6%` | `DemandForecastRecord.predictedDemand` | AI Demand Forecast | Benchmarked against attendance and weather |
| **11** | `Promotion` | `Binary (Yes/No)` | Whether a promotion/discount or special event ran | `0.0% (None)` | `DemandForecastRecord.isSpecialMenu` | Demand Forecasting | Affects meal consumption surge |
| **12** | `Weather` | `Categorical` | `Sunny`, `Rainy`, `Cloudy`, `Hot` | `~2.5%` | `DemandForecastRecord.weather` | Demand Forecasting | Directly mapped to local weather feature |
| **13** | `Waste_Quantity` | `Integer` | Units wasted from remaining stock (`<= Remaining`) | `0.0% (None)` | `FoodBatch.remainingKg` / `remainingMeals` | Surplus Detection | Primary candidate for NGO redistribution |
| **14** | `Waste_Reason` | `Categorical` | `Expired`, `Overproduction`, `Low Demand`, `Storage Issue`, `No Waste` | `0.0% (None)` | Kitchen Root Cause Tag | Sustainability & Reports | Overproduction & Low Demand are redeemable |
| **15** | `Donation_Made` | `Binary (Yes/No)` | Whether safe food was redirected to shelters | `~2.9%` | `DonationRequest.status` (`Offered` / `Accepted`) | NGO Partner Matching | Directly correlates with rescue rate |
| **16** | `Waste_Level` | `Categorical` | Severity level: `Low`, `Medium`, `High` | `0.0% (None)` | `DemandForecastRecord.overproductionRisk` | Decision Support | Risk classification indicator |

---

## 🛡️ Dataset Safety & Governance Checklist

- [x] **Separation:** Raw files stored in `datasets/raw/ai_powered_food_waste_management/` and omitted from the client production bundle.
- [x] **No Machine Learning Claims:** This dataset is utilized strictly for schema exploration, edge-case testing, and pipeline workflow verification. No real-world predictive ML claims are asserted.
- [x] **Administrator Protection:** Ingestion and auditing are strictly restricted to the `Administrator` role via the Dataset Management console.
- [x] **Non-Destructive Integration:** External records must never overwrite existing canonical demo state or user local settings without explicit modal confirmation.
