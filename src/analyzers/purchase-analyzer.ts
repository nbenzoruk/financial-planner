import { Purchase, PurchaseAnalysis } from '../models/types';
import { BiasDetector } from './bias-detector';

export class PurchaseAnalyzer {
  // Анализ рентабельности покупки
  static analyze(purchase: Purchase, allPurchases: Purchase[]): PurchaseAnalysis {
    const costPerUse = this.calculateCostPerUse(purchase);
    const totalCostOfOwnership = this.calculateTotalCostOfOwnership(purchase);
    const dailyEquivalent = this.calculateDailyEquivalent(purchase);

    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Детектор когнитивных искажений
    const biasWarnings = BiasDetector.detectForPurchase(purchase, allPurchases);
    warnings.push(...biasWarnings);

    // Анализ стоимости использования
    if (costPerUse > purchase.price * 0.1) {
      warnings.push('Высокая стоимость одного использования. Возможно, стоит рассмотреть аренду или альтернативы.');
    }

    // Анализ частоты использования
    if (purchase.usageFrequency === 'rarely' && purchase.price > 1000) {
      warnings.push('Дорогая покупка с редким использованием. Рассмотрите возможность аренды.');
      recommendations.push(`Аренда может обойтись дешевле. Оцените стоимость аренды vs ${purchase.price.toFixed(2)}`);
    }

    // Сравнение с альтернативной стоимостью
    if (purchase.alternativeCost && purchase.alternativeCost < purchase.price * 0.7) {
      recommendations.push(`Альтернативный вариант может сэкономить ${(purchase.price - purchase.alternativeCost).toFixed(2)}`);
    }

    // Анализ стоимости обслуживания
    if (purchase.maintenanceCostPerYear && purchase.expectedLifespanYears) {
      const totalMaintenance = purchase.maintenanceCostPerYear * purchase.expectedLifespanYears;
      if (totalMaintenance > purchase.price * 0.5) {
        warnings.push(`Стоимость обслуживания (${totalMaintenance.toFixed(2)}) составляет более 50% от цены покупки.`);
      }
    }

    // Рекомендации по оптимизации
    if (dailyEquivalent > 10 && purchase.expectedLifespanYears && purchase.expectedLifespanYears < 2) {
      recommendations.push('Рассмотрите более долговечные варианты для снижения ежедневных затрат.');
    }

    return {
      purchaseId: purchase.id,
      costPerUse,
      totalCostOfOwnership,
      dailyEquivalent,
      warnings,
      recommendations
    };
  }

  // Расчет стоимости одного использования
  private static calculateCostPerUse(purchase: Purchase): number {
    if (!purchase.expectedLifespanYears || !purchase.usageFrequency) {
      return purchase.price;
    }

    const usesPerYear = this.getUsesPerYear(purchase.usageFrequency);
    const totalUses = usesPerYear * purchase.expectedLifespanYears;

    return purchase.price / totalUses;
  }

  // Расчет полной стоимости владения (TCO - Total Cost of Ownership)
  private static calculateTotalCostOfOwnership(purchase: Purchase): number {
    let tco = purchase.price;

    if (purchase.maintenanceCostPerYear && purchase.expectedLifespanYears) {
      tco += purchase.maintenanceCostPerYear * purchase.expectedLifespanYears;
    }

    return tco;
  }

  // Расчет эквивалента стоимости в день
  private static calculateDailyEquivalent(purchase: Purchase): number {
    if (!purchase.expectedLifespanYears) {
      return purchase.price / 365; // Условно 1 год
    }

    const tco = this.calculateTotalCostOfOwnership(purchase);
    const totalDays = purchase.expectedLifespanYears * 365;

    return tco / totalDays;
  }

  // Получение количества использований в год
  private static getUsesPerYear(frequency: Purchase['usageFrequency']): number {
    switch (frequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'monthly': return 12;
      case 'rarely': return 4;
      default: return 12;
    }
  }

  // Форматированный вывод анализа
  static formatAnalysis(analysis: PurchaseAnalysis): string {
    let output = '\n=== Анализ рентабельности покупки ===\n\n';

    output += `💰 Полная стоимость владения: ${analysis.totalCostOfOwnership.toFixed(2)}\n`;
    output += `📊 Стоимость одного использования: ${analysis.costPerUse.toFixed(2)}\n`;
    output += `📅 Эквивалент в день: ${analysis.dailyEquivalent.toFixed(2)}\n\n`;

    if (analysis.warnings.length > 0) {
      output += '⚠️  ПРЕДУПРЕЖДЕНИЯ:\n';
      analysis.warnings.forEach(w => output += `  • ${w}\n`);
      output += '\n';
    }

    if (analysis.recommendations.length > 0) {
      output += '💡 РЕКОМЕНДАЦИИ:\n';
      analysis.recommendations.forEach(r => output += `  • ${r}\n`);
      output += '\n';
    }

    return output;
  }
}
