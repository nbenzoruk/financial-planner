# Cognitive Biases Detection

## Overview

The bias detector analyzes user behavior patterns to identify cognitive biases that may lead to poor financial decisions.

## Purchase Biases

### 1. Sunk Cost Fallacy
**Detection:** 2+ purchases in same category within 6 months
**Logic:** Users may continue investing in a category due to past spending rather than current value
**Warning:** "Don't let past expenses influence current decisions"

### 2. Lifestyle Creep
**Detection:** New purchase price > 1.5x average previous category purchases
**Logic:** Gradual increase in spending standards without conscious decision
**Warning:** "Ensure this is intentional, not automatic standard raising"

### 3. Anchoring Bias
**Detection:** Purchase price > 1.3x alternative cost (if provided)
**Logic:** Users fixated on initial price/discount rather than true value
**Warning:** "Compare with real value, not just initial price or discount"

### 4. Recency Bias
**Detection:** 5+ purchases in last 30 days
**Logic:** Reacting to short-term stimuli rather than real needs
**Warning:** "Frequent recent purchases - reacting to short-term stimuli?"

### 5. Loss Aversion
**Detection:** Purchase name contains keywords (страховка, защита, гарантия, резервный, backup) AND price > 500
**Logic:** Buying to avoid potential losses with overestimated probability
**Warning:** "Evaluate real probability of these losses"

## Investment Biases

### 1. FOMO (Fear of Missing Out)
**Detection:** High risk + expected return > 50% + time horizon < 3 years
**Logic:** Rush to invest in trending opportunities without proper analysis
**Warning:** "Ensure this isn't fear of missing opportunity"

### 2. Confirmation Bias
**Detection:** High risk + expected return > 30%
**Logic:** Overly optimistic forecasts ignoring pessimistic scenarios
**Warning:** "Consider pessimistic scenarios too"

### 3. Overconfidence
**Detection:** High-risk investments > 40% of total portfolio value
**Logic:** Overestimating ability to predict outcomes
**Warning:** "Possible overestimation of forecasting abilities"

## Implementation Notes

- All detection happens in `src/analyzers/bias-detector.ts`
- Detectors run automatically when adding/analyzing items
- Thresholds are calibrated based on common behavioral patterns
- Warnings are informational, not blocking

## Extending Detection

To add new bias detection:
1. Add bias type to `CognitiveBias` type in `types.ts`
2. Implement detection method in `BiasDetector` class
3. Add to `detectForPurchase()` or `detectForInvestment()`
4. Include clear warning message explaining the bias
