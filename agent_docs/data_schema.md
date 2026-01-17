# Data Schema

## Storage Format

Single JSON file: `data/financial-data.json`

```typescript
interface FinancialData {
  purchases: Purchase[];
  investments: Investment[];
  lastUpdated: string;  // ISO 8601 timestamp
}
```

## Purchase Schema

```typescript
interface Purchase {
  id: string;                    // UUID v4
  name: string;                  // Purchase name
  price: number;                 // Purchase price
  date: string;                  // ISO 8601 timestamp
  category: string;              // User-defined category

  // Optional analysis fields
  expectedLifespanYears?: number;
  maintenanceCostPerYear?: number;
  alternativeCost?: number;
  usageFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  notes?: string;
}
```

## Investment Schema

```typescript
interface Investment {
  id: string;                    // UUID v4
  name: string;                  // Investment name
  type: 'stocks' | 'bonds' | 'real-estate' | 'crypto' | 'business' | 'other';
  initialAmount: number;         // Initial investment
  currentValue?: number;         // Current market value
  date: string;                  // ISO 8601 timestamp
  expectedReturnPercent: number; // Annual expected return
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizonYears: number;      // Investment time horizon
  notes?: string;
}
```

## ID Generation

All IDs use UUID v4:
```typescript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();
```

## Date Handling

All dates stored as ISO 8601 strings:
```typescript
const date = new Date().toISOString();
// Example: "2026-01-17T16:18:56.689Z"
```

## Data Persistence

**Location:** Always `data/financial-data.json` relative to project root

**Access:** Through `Storage` class methods:
- `Storage.load()` - Read entire data file
- `Storage.save(data)` - Write entire data file
- `Storage.addPurchase(purchase)` - Add purchase
- `Storage.addInvestment(investment)` - Add investment
- `Storage.getPurchase(id)` - Get single purchase
- `Storage.updatePurchase(id, updates)` - Update purchase
- `Storage.deletePurchase(id)` - Delete purchase

**Auto-creation:** Storage creates `data/` directory and empty JSON file if missing

## Data Validation

No formal validation layer. TypeScript types provide compile-time safety.

**Runtime assumptions:**
- IDs are always valid UUIDs
- Dates are always valid ISO 8601 strings
- Numbers are always valid (no NaN checks)
- Required fields are always present

## Git Integration

Data file designed for Git versioning:
- Pretty-printed JSON (2-space indent)
- Consistent ordering
- Human-readable diffs
- No binary data

Users can track financial history via Git commits.
