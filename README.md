# JPM DyeFlow
### Lab Approval → Bulk Order → Dyeing → Delivery Management System
**Junior Processing Mills (JPM) Enterprise Operations Suite**

---

## 🌟 Overview

**JPM DyeFlow** is a purpose-built enterprise operations platform designed for **Junior Processing Mills (JPM)**. It provides end-to-end traceability across the textile wet-processing lifecycle, utilizing the **Lab Approval Number** (e.g. `8157-26/A`) as the core reference connecting shade formulation to customer delivery.

---

## 🔄 Core Business Process

```
Customer gives fabric/sample
        ↓
Lab Colour Matching & Formulation (Lab RC)
        ↓
Lab RC / Colour Approval (ΔE < 0.80)
        ↓
Customer Approval Desk
        ↓
Bulk Order Received & Lot Allocation
        ↓
Dyeing / Production (Softflow & HTHP Vessels)
        ↓
Ready for Delivery (Stenter / Hydro / Pack)
        ↓
Dispatched (E-Way Bill & Gate Pass)
        ↓
Delivered (Signed Proof of Delivery / POD)
```

---

## 🔑 Key Features

1. **Operations Overview & 5-Step Process Pipeline**:
   - `LAB (24 Samples) → APPROVAL (08 Pending) → BULK (35 Orders / 12,500 KG) → PRODUCTION (20 Active) → DELIVERY (08 Ready)`
   - Live metrics and Bulk Order Movement tracking.

2. **Lab Approvals & Recipe Cards (Lab RC)**:
   - Split-layout interface for formulation review.
   - Spectrophotometer $\Delta E$ tolerance verification and physical swatch comparison.
   - Chemical recipe breakdown and direct **"BULK ORDER LINK"**.

3. **Customer Approval Desk**:
   - Status tracking (`Awaiting Customer`, `Approved`, `Rejected`, `Resubmission Required`).
   - Customer feedback and metamerism rejection logging.

4. **Bulk Orders Register**:
   - Order management with 4-tier relationship drawer:
     $$\text{Lab Approval} \longrightarrow \text{Bulk Order} \longrightarrow \text{Production} \longrightarrow \text{Delivery}$$

5. **Dye House Production Board**:
   - 4-stage tracking: `Queued` $\rightarrow$ `Dyeing` $\rightarrow$ `QC` $\rightarrow$ `Completed`.
   - Machine telemetry (vessel allocation, temperature, pH).

6. **Logistics & Proof of Delivery (POD)**:
   - Vehicle allocation, E-Way Bill generation, and digital POD sign-off archiving.

7. **Full Audit Trace & Job Card Printing**:
   - Click any Lab Approval Number to view its full lifecycle audit trail with printable traveler chits.

8. **Selsoft ERP Integration Ready**:
   - Standardized REST/JSON data contract for ERP synchronization.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm / pnpm / yarn

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/PRADEEP0502/JPM-Dyeflow-.git
cd JPM-Dyeflow-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Modular Component-Driven State with Context API
