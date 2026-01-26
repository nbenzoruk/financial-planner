import { Validator, ValidationError } from '../validator';
import { Purchase, Investment } from '../../models/types';

describe('Validator', () => {
  describe('validatePurchase', () => {
    it('should accept valid purchase', () => {
      const validPurchase: Partial<Purchase> = {
        name: 'Test Item',
        price: 100,
        category: 'Electronics',
        expectedLifespanYears: 5,
        usageFrequency: 'daily'
      };

      expect(() => Validator.validatePurchase(validPurchase)).not.toThrow();
    });

    it('should reject empty name', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: '',
        price: 100,
        category: 'Electronics'
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow(ValidationError);
    });

    it('should reject negative price', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: 'Test',
        price: -50,
        category: 'Electronics'
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow('Цена должна быть положительным числом');
    });

    it('should reject zero price', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: 'Test',
        price: 0,
        category: 'Electronics'
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow('Цена должна быть положительным числом');
    });

    it('should reject price over limit', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: 'Test',
        price: 2000000000,
        category: 'Electronics'
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow('Цена слишком велика');
    });

    it('should reject invalid usage frequency', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: 'Test',
        price: 100,
        category: 'Electronics',
        usageFrequency: 'sometimes' as any
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow('Частота использования должна быть одной из');
    });

    it('should reject negative lifespan', () => {
      const invalidPurchase: Partial<Purchase> = {
        name: 'Test',
        price: 100,
        category: 'Electronics',
        expectedLifespanYears: -1
      };

      expect(() => Validator.validatePurchase(invalidPurchase))
        .toThrow('Срок службы должен быть положительным числом');
    });
  });

  describe('validateInvestment', () => {
    it('should accept valid investment', () => {
      const validInvestment: Partial<Investment> = {
        name: 'S&P 500',
        initialAmount: 10000,
        type: 'stocks',
        expectedReturnPercent: 10,
        riskLevel: 'medium',
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(validInvestment)).not.toThrow();
    });

    it('should reject empty name', () => {
      const invalidInvestment: Partial<Investment> = {
        name: '',
        initialAmount: 10000,
        type: 'stocks',
        expectedReturnPercent: 10,
        riskLevel: 'medium',
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(invalidInvestment))
        .toThrow(ValidationError);
    });

    it('should reject negative initial amount', () => {
      const invalidInvestment: Partial<Investment> = {
        name: 'Test',
        initialAmount: -1000,
        type: 'stocks',
        expectedReturnPercent: 10,
        riskLevel: 'medium',
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(invalidInvestment))
        .toThrow('Начальная сумма должна быть положительным числом');
    });

    it('should reject invalid investment type', () => {
      const invalidInvestment: Partial<Investment> = {
        name: 'Test',
        initialAmount: 10000,
        type: 'invalid-type' as any,
        expectedReturnPercent: 10,
        riskLevel: 'medium',
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(invalidInvestment))
        .toThrow('Тип инвестиции должен быть одним из');
    });

    it('should reject invalid risk level', () => {
      const invalidInvestment: Partial<Investment> = {
        name: 'Test',
        initialAmount: 10000,
        type: 'stocks',
        expectedReturnPercent: 10,
        riskLevel: 'extreme' as any,
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(invalidInvestment))
        .toThrow('Уровень риска должен быть одним из');
    });

    it('should reject unrealistic return percentage', () => {
      const invalidInvestment: Partial<Investment> = {
        name: 'Test',
        initialAmount: 10000,
        type: 'stocks',
        expectedReturnPercent: 20000,
        riskLevel: 'medium',
        timeHorizonYears: 10
      };

      expect(() => Validator.validateInvestment(invalidInvestment))
        .toThrow('Ожидаемая доходность должна быть в диапазоне');
    });
  });

  describe('checkInvestmentSanity', () => {
    it('should warn about high return with low risk', () => {
      const investment: Investment = {
        id: '1',
        name: 'Test',
        initialAmount: 10000,
        type: 'bonds',
        expectedReturnPercent: 20,
        riskLevel: 'low',
        timeHorizonYears: 5,
        date: new Date().toISOString()
      };

      const warnings = Validator.checkInvestmentSanity(investment);
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0]).toContain('риске');
    });

    it('should warn about short-term stock investment', () => {
      const investment: Investment = {
        id: '1',
        name: 'Test',
        initialAmount: 10000,
        type: 'stocks',
        expectedReturnPercent: 10,
        riskLevel: 'medium',
        timeHorizonYears: 2,
        date: new Date().toISOString()
      };

      const warnings = Validator.checkInvestmentSanity(investment);
      expect(warnings.some(w => w.includes('Краткосрочные'))).toBe(true);
    });

    it('should warn about long-term crypto investment', () => {
      const investment: Investment = {
        id: '1',
        name: 'Bitcoin',
        initialAmount: 10000,
        type: 'crypto',
        expectedReturnPercent: 50,
        riskLevel: 'high',
        timeHorizonYears: 15,
        date: new Date().toISOString()
      };

      const warnings = Validator.checkInvestmentSanity(investment);
      expect(warnings.some(w => w.includes('Долгосрочные'))).toBe(true);
    });
  });

  describe('checkPurchaseSanity', () => {
    it('should warn about high maintenance cost', () => {
      const purchase: Purchase = {
        id: '1',
        name: 'Expensive Car',
        price: 50000,
        category: 'Transport',
        date: new Date().toISOString(),
        expectedLifespanYears: 5,
        maintenanceCostPerYear: 15000
      };

      const warnings = Validator.checkPurchaseSanity(purchase);
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0]).toContain('обслуживания');
    });

    it('should warn about expensive short-lived item', () => {
      const purchase: Purchase = {
        id: '1',
        name: 'Fashion Item',
        price: 1000,
        category: 'Clothing',
        date: new Date().toISOString(),
        expectedLifespanYears: 0.5
      };

      const warnings = Validator.checkPurchaseSanity(purchase);
      expect(warnings.some(w => w.includes('срок'))).toBe(true);
    });
  });
});
