# Financial Planner

## What (Technical Stack & Architecture)

TypeScript CLI application for analyzing purchases and investments with cognitive bias detection.

**Stack:**
- TypeScript 5.3
- Node.js
- Commander.js (CLI framework)
- UUID for ID generation

**Project Structure:**
```
src/
├── analyzers/          # Analysis modules
│   ├── purchase-analyzer.ts    # TCO, cost-per-use calculations
│   ├── investment-analyzer.ts  # ROI, risk-adjusted returns
│   └── bias-detector.ts        # Cognitive bias detection logic
├── commands/           # CLI command handlers
│   ├── purchase.ts     # Purchase management commands
│   └── investment.ts   # Investment management commands
├── models/
│   └── types.ts        # Core data types
├── utils/
│   └── storage.ts      # JSON file storage in data/
└── index.ts            # Entry point
```

**Data Storage:**
- All data stored in `data/financial-data.json`
- Plain JSON format, designed for Git versioning
- No database required

## Why (Purpose)

Help users make rational financial decisions by:
1. Calculating true cost of purchases (TCO, cost-per-use, daily equivalent)
2. Analyzing investment returns with risk adjustments
3. **Detecting cognitive biases** (Sunk Cost, FOMO, Lifestyle Creep, etc.)

The cognitive bias detection is the key differentiator.

## How (Working with the Project)

**Build & Run:**
```bash
npm install
npm run build           # Compile TypeScript
node dist/index.js      # Run CLI
```

**Development:**
```bash
npm run dev            # Watch mode with tsx
npm run type-check     # Type checking without emit
```

**CLI Commands:**
```bash
# Purchases
node dist/index.js purchase add -n "Name" -p 1000 -c "Category" [options]
node dist/index.js purchase analyze <id>
node dist/index.js purchase list

# Investments
node dist/index.js investment add -n "Name" -a 10000 -t stocks -r 10 --risk medium --horizon 10
node dist/index.js investment analyze <id>
node dist/index.js investment list
```

**Testing Changes:**
After modifying analyzer logic, test with sample data:
```bash
node dist/index.js purchase add -n "Test" -p 100 -c "Test" -l 1 -f daily
```

## Key Concepts

**Cognitive Biases Detected:**
- **Purchases:** Sunk Cost Fallacy, Lifestyle Creep, Anchoring, Recency Bias, Loss Aversion
- **Investments:** FOMO, Confirmation Bias, Overconfidence

**Analysis Outputs:**
- Purchase: TCO, cost-per-use, daily equivalent, warnings, recommendations
- Investment: Projected value, ROI, compounded return, risk-adjusted return

## Documentation

- `README.md` - User-facing guide with detailed examples
- `agent_docs/` - Additional technical documentation

## Important Notes

- **Data file location:** Always in `data/financial-data.json` relative to project root
- **No external APIs:** All calculations done locally
- **Git-friendly:** JSON data designed for version control
