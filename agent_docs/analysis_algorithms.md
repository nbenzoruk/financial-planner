# Analysis Algorithms

## Purchase Analysis

### Cost Per Use
```typescript
costPerUse = price / (usesPerYear * expectedLifespanYears)
```

**Uses per year by frequency:**
- daily: 365
- weekly: 52
- monthly: 12
- rarely: 4

### Total Cost of Ownership (TCO)
```typescript
TCO = price + (maintenanceCostPerYear * expectedLifespanYears)
```

### Daily Equivalent
```typescript
dailyEquivalent = TCO / (expectedLifespanYears * 365)
```

## Investment Analysis

### Projected Value
```typescript
projectedValue = initialAmount * (1 + returnRate)^years
```

### ROI (Return on Investment)
```typescript
ROI = ((projectedValue - initialAmount) / initialAmount) * 100
```

### Compounded Return
```typescript
compoundedReturn = ((1 + returnRate)^years - 1) * 100
```

### Risk-Adjusted Return (Simplified Sharpe Ratio)
```typescript
riskPremium = expectedReturn - safeRate  // safeRate = 5%
riskMultiplier = { low: 0.5, medium: 1.0, high: 2.0 }
riskAdjustedReturn = riskPremium / riskMultiplier[riskLevel]
```

## Analysis Triggers

### Purchase Warnings
- Cost per use > 10% of price → High usage cost
- Rarely used items > $1000 → Consider rental
- Maintenance > 50% of price → High ownership cost
- Alternative cost < 70% of price → Cheaper alternatives exist

### Investment Warnings
- High risk + expected return < 15% → Poor risk/reward ratio
- Expected return < safe rate (5%) for non-low risk → Below safe rate
- Current value < 80% of initial → Consider rebalancing
- Time horizon < 3 years + high risk → Too short for high risk

## Constants & Defaults

```typescript
SAFE_RATE = 5  // Risk-free rate assumption
DEFAULT_LIFESPAN = 1  // Years if not specified
SUNK_COST_WINDOW = 180  // Days to check for pattern
LIFESTYLE_CREEP_MULTIPLIER = 1.5  // Threshold for detection
```

## Notes

- All monetary values should be in same currency
- Time calculations assume 365 days per year
- Risk multipliers are heuristic, not actuarial
- Analysis is educational, not financial advice
