import { Purchase, Investment } from '../models/types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validator {
  // Валидация покупки
  static validatePurchase(purchase: Partial<Purchase>): void {
    if (!purchase.name || purchase.name.trim().length === 0) {
      throw new ValidationError('Название покупки не может быть пустым');
    }

    if (typeof purchase.price !== 'number' || purchase.price <= 0) {
      throw new ValidationError('Цена должна быть положительным числом');
    }

    if (purchase.price > 1000000000) {
      throw new ValidationError('Цена слишком велика (максимум: 1 млрд)');
    }

    if (!purchase.category || purchase.category.trim().length === 0) {
      throw new ValidationError('Категория не может быть пустой');
    }

    if (purchase.expectedLifespanYears !== undefined) {
      if (typeof purchase.expectedLifespanYears !== 'number' || purchase.expectedLifespanYears <= 0) {
        throw new ValidationError('Срок службы должен быть положительным числом');
      }
      if (purchase.expectedLifespanYears > 100) {
        throw new ValidationError('Срок службы слишком велик (максимум: 100 лет)');
      }
    }

    if (purchase.maintenanceCostPerYear !== undefined) {
      if (typeof purchase.maintenanceCostPerYear !== 'number' || purchase.maintenanceCostPerYear < 0) {
        throw new ValidationError('Стоимость обслуживания должна быть неотрицательным числом');
      }
    }

    if (purchase.alternativeCost !== undefined) {
      if (typeof purchase.alternativeCost !== 'number' || purchase.alternativeCost < 0) {
        throw new ValidationError('Альтернативная стоимость должна быть неотрицательным числом');
      }
    }

    const validFrequencies = ['daily', 'weekly', 'monthly', 'rarely'];
    if (purchase.usageFrequency && !validFrequencies.includes(purchase.usageFrequency)) {
      throw new ValidationError(`Частота использования должна быть одной из: ${validFrequencies.join(', ')}`);
    }
  }

  // Валидация инвестиции
  static validateInvestment(investment: Partial<Investment>): void {
    if (!investment.name || investment.name.trim().length === 0) {
      throw new ValidationError('Название инвестиции не может быть пустым');
    }

    if (typeof investment.initialAmount !== 'number' || investment.initialAmount <= 0) {
      throw new ValidationError('Начальная сумма должна быть положительным числом');
    }

    if (investment.initialAmount > 10000000000) {
      throw new ValidationError('Начальная сумма слишком велика (максимум: 10 млрд)');
    }

    const validTypes = ['stocks', 'bonds', 'real-estate', 'crypto', 'business', 'other'];
    if (!investment.type || !validTypes.includes(investment.type)) {
      throw new ValidationError(`Тип инвестиции должен быть одним из: ${validTypes.join(', ')}`);
    }

    if (typeof investment.expectedReturnPercent !== 'number') {
      throw new ValidationError('Ожидаемая доходность должна быть числом');
    }

    if (investment.expectedReturnPercent < -100 || investment.expectedReturnPercent > 10000) {
      throw new ValidationError('Ожидаемая доходность должна быть в диапазоне от -100% до 10000%');
    }

    const validRiskLevels = ['low', 'medium', 'high'];
    if (!investment.riskLevel || !validRiskLevels.includes(investment.riskLevel)) {
      throw new ValidationError(`Уровень риска должен быть одним из: ${validRiskLevels.join(', ')}`);
    }

    if (typeof investment.timeHorizonYears !== 'number' || investment.timeHorizonYears <= 0) {
      throw new ValidationError('Срок инвестиции должен быть положительным числом');
    }

    if (investment.timeHorizonYears > 100) {
      throw new ValidationError('Срок инвестиции слишком велик (максимум: 100 лет)');
    }

    if (investment.currentValue !== undefined) {
      if (typeof investment.currentValue !== 'number' || investment.currentValue < 0) {
        throw new ValidationError('Текущая стоимость должна быть неотрицательным числом');
      }
    }
  }

  // Проверка разумности параметров инвестиции
  static checkInvestmentSanity(investment: Investment): string[] {
    const warnings: string[] = [];

    // Высокая доходность при низком риске - подозрительно
    if (investment.riskLevel === 'low' && investment.expectedReturnPercent > 15) {
      warnings.push('Высокая ожидаемая доходность при низком риске - это необычно. Проверьте свои ожидания.');
    }

    // Низкая доходность при высоком риске - нелогично
    if (investment.riskLevel === 'high' && investment.expectedReturnPercent < 10) {
      warnings.push('Низкая ожидаемая доходность при высоком риске - возможно, это не лучшая инвестиция.');
    }

    // Краткосрочный горизонт для акций
    if (investment.type === 'stocks' && investment.timeHorizonYears < 3) {
      warnings.push('Краткосрочные инвестиции в акции рискованны. Рекомендуется горизонт от 5 лет.');
    }

    // Долгосрочный горизонт для криптовалют
    if (investment.type === 'crypto' && investment.timeHorizonYears > 10) {
      warnings.push('Долгосрочные прогнозы для криптовалют ненадежны из-за высокой волатильности.');
    }

    return warnings;
  }

  // Проверка разумности параметров покупки
  static checkPurchaseSanity(purchase: Purchase): string[] {
    const warnings: string[] = [];

    // Высокая стоимость обслуживания
    if (purchase.maintenanceCostPerYear && purchase.expectedLifespanYears) {
      const totalMaintenance = purchase.maintenanceCostPerYear * purchase.expectedLifespanYears;
      if (totalMaintenance > purchase.price) {
        warnings.push('Стоимость обслуживания превышает цену покупки. Возможно, стоит рассмотреть аренду.');
      }
    }

    // Очень короткий срок службы дорогой вещи
    if (purchase.expectedLifespanYears && purchase.expectedLifespanYears < 1 && purchase.price > 500) {
      warnings.push('Дорогая покупка со сроком службы менее года. Убедитесь, что это оправдано.');
    }

    return warnings;
  }
}
