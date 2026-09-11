# JPM DyeFlow

**Lab Delivery → ERP Bulk Order Reconciliation Dashboard**
Junior Processing Mills (JPM) — Textile Wet-Processing Operations

---

## Overview

JPM DyeFlow tracks how lab-approved colour samples convert into confirmed ERP bulk production orders. Every delivered lab sample (LDN) is reconciled against Selsoft ERP to show whether a corresponding bulk order has been placed, and if not, how long it has been waiting.

The workflow it models:

```
LRN (Lab Receive)  →  Lab Processing (dye trial & shade match)  →  LDN (Lab Delivery)  →  ERP Bulk Matching
```

## Features

- **Summary & Overview** — key metrics (samples delivered, bulk orders converted, confirmed quantity, pending orders), a 4-step workflow stepper, buyer-wise conversion performance with progress bars, and an overall conversion-rate breakdown.
- **All LDN Deliveries** — full register of delivered lab samples cross-matched against ERP bulk orders, filterable by status (All / Matched Bulk / Waiting) and by customer.
- **Pending Bulk Orders** — samples delivered to a customer with no bulk order yet logged in ERP, sorted by days elapsed.
- **Search** — instant search across LDN, LRN, lab approval number, customer, colour name, and bulk order number.
- **Record detail modal** — per-sample audit trail (LRN inward → LDN outward → ERP bulk match) with full spec attributes.
- Responsive layout — table view on desktop/tablet, card view on mobile, with a collapsible mobile nav drawer.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
src/
  App.tsx          # Single-page app: header, dashboard, data grid, detail modal
  data/mockData.ts # Sample LDN records and summary numbers
  types/index.ts    # LdnItem, NavTab and related types
  main.tsx, index.css
```

Currently the app runs on mock data in [src/data/mockData.ts](src/data/mockData.ts). Replace this with a live ERP/API data source to move beyond the demo dataset.

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Install & Run

```bash
git clone https://github.com/PRADEEP0502/JPM-Dyeflow-.git
cd JPM-Dyeflow-
npm install
npm run dev
```

### Other Scripts

```bash
npm run build     # Type-check and build for production
npm run preview   # Preview the production build locally
```

---

*This README reflects the current LDN-to-bulk reconciliation dashboard implementation. Broader ERP modules described in earlier versions of this document (lab RC, dye house production board, logistics/POD) are not part of the current codebase.*
