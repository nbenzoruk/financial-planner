import { BiasDetector } from '../bias-detector';
import { Purchase, Investment } from '../../models/types';

describe('BiasDetector', () => {
  describe('detectForPurchase', () => {
    const basePurchase: Purchase = {
      id: '1',
      name: 'Test Purchase',
      price: 1000,
      category: 'Electronics',
      date: new Date().toISOString()
    };

    it('should detect sunk cost fallacy', () => {
      const existingPurchases: Purchase[] = [
        { ...basePurchase, id: '2', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { ...basePurchase, id: '3', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      const warnings = BiasDetector.detectForPurchase(basePurchase, existingPurchases);
      expect(warnings.some(w => w.includes('SUNK COST'))).toBe(true);
    });

    it('should detect lifestyle creep', () => {
      const existingPurchases: Purchase[] = [
        { ...basePurchase, id: '2', price: 500 },
        { ...basePurchase, id: '3', price: 600 }
      ];

      const newPurchase = { ...basePurchase, price: 2000 };

      const warnings = BiasDetector.detectForPurchase(newPurchase, existingPurchases);
      expect(warnings.some(w => w.includes('LIFESTYLE CREEP'))).toBe(true);
    });

    it('should detect anchoring bias', () => {
      const purchase: Purchase = {
        ...basePurchase,
        price: 1000,
        alternativeCost: 500
      };

      const warnings = BiasDetector.detectForPurchase(purchase, []);
      expect(warnings.some(w => w.includes('ANCHORING'))).toBe(true);
    });

    it('should detect recency bias', () => {
      const recentPurchases: Purchase[] = [];
      for (let i = 0; i < 5; i++) {
        recentPurchases.push({
          ...basePurchase,
          id: `${i}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      const warnings = BiasDetector.detectForPurchase(basePurchase, recentPurchases);
      expect(warnings.some(w => w.includes('RECENCY'))).toBe(true);
    });

    it('should detect loss aversion', () => {
      const purchase: Purchase = {
        ...basePurchase,
        name: 'Страховка от всего',
        price: 1000
      };

      const warnings = BiasDetector.detectForPurchase(purchase, []);
      expect(warnings.some(w => w.includes('LOSS AVERSION'))).toBe(true);
    });
  });

  describe('detectForInvestment', () => {
    const baseInvestment: Investment = {
      id: '1',
      name: 'Test Investment',
      initialAmount: 10000,
      type: 'stocks',
      expectedReturnPercent: 10,
      riskLevel: 'medium',
      timeHorizonYears: 10,
      date: new Date().toISOString()
    };

    it('should detect FOMO', () => {
      const fomoInvestment: Investment = {
        ...baseInvestment,
        riskLevel: 'high',
        expectedReturnPercent: 100,
        timeHorizonYears: 1
      };

      const warnings = BiasDetector.detectForInvestment(fomoInvestment, []);
      expect(warnings.some(w => w.includes('FOMO'))).toBe(true);
    });

    it('should detect confirmation bias', () => {
      const biasedInvestment: Investment = {
        ...baseInvestment,
        riskLevel: 'high',
        expectedReturnPercent: 50
      };

      const warnings = BiasDetector.detectForInvestment(biasedInvestment, []);
      expect(warnings.some(w => w.includes('CONFIRMATION BIAS'))).toBe(true);
    });

    it('should detect overconfidence', () => {
      const highRiskInvestments: Investment[] = [
        { ...baseInvestment, id: '2', riskLevel: 'high', initialAmount: 5000 },
        { ...baseInvestment, id: '3', riskLevel: 'high', initialAmount: 5000 },
        { ...baseInvestment, id: '4', riskLevel: 'low', initialAmount: 2000 }
      ];

      const newHighRisk: Investment = {
        ...baseInvestment,
        riskLevel: 'high',
        initialAmount: 5000
      };

      const warnings = BiasDetector.detectForInvestment(newHighRisk, highRiskInvestments);
      expect(warnings.some(w => w.includes('OVERCONFIDENCE'))).toBe(true);
    });

    it('should not detect biases for reasonable investment', () => {
      const reasonableInvestment: Investment = {
        ...baseInvestment,
        riskLevel: 'low',
        expectedReturnPercent: 5,
        timeHorizonYears: 10
      };

      const warnings = BiasDetector.detectForInvestment(reasonableInvestment, []);
      expect(warnings.length).toBe(0);
    });
  });
});
