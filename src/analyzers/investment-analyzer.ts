import { Investment, InvestmentAnalysis } from '../models/types';

export class InvestmentAnalyzer {
  // Анализ инвестиции
  static analyze(investment: Investment): InvestmentAnalysis {
    const projectedValue = this.calculateProjectedValue(investment);
    const roi = this.calculateROI(investment);
    const compoundedReturn = this.calculateCompoundedReturn(investment);
    const riskAdjustedReturn = this.calculateRiskAdjustedReturn(investment);

    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Анализ риска
    if (investment.riskLevel === 'high' && investment.expectedReturnPercent < 15) {
      warnings.push('Высокий риск при относительно низкой ожидаемой доходности. Возможно, не оптимальное соотношение риск/доходность.');
    }

    // Анализ диверсификации
    if (investment.type === 'crypto' && investment.riskLevel === 'high') {
      recommendations.push('Рассмотрите диверсификацию портфеля. Высокорисковые криптоактивы не должны составлять более 10-15% портфеля.');
    }

    // Анализ горизонта инвестирования
    if (investment.timeHorizonYears < 3 && investment.riskLevel === 'high') {
      warnings.push('Короткий горизонт инвестирования для высокорискового актива. Рассмотрите более консервативные варианты.');
    }

    // Сравнение с базовыми ставками
    const safeRate = 5; // Условная безрисковая ставка
    if (investment.expectedReturnPercent < safeRate && investment.riskLevel !== 'low') {
      warnings.push(`Ожидаемая доходность ниже безрисковой ставки (${safeRate}%). Возможно, стоит пересмотреть инвестицию.`);
    }

    // Рекомендации по оптимизации
    if (investment.expectedReturnPercent > 20 && investment.riskLevel === 'low') {
      warnings.push('Необычно высокая доходность при низком риске. Проверьте реалистичность прогнозов.');
    }

    // Анализ текущей стоимости vs начальной
    if (investment.currentValue && investment.currentValue < investment.initialAmount * 0.8) {
      warnings.push('Текущая стоимость упала более чем на 20%. Оцените необходимость ребалансировки портфеля.');
      recommendations.push('Проанализируйте причины падения. Это временная коррекция или фундаментальные проблемы?');
    }

    return {
      investmentId: investment.id,
      projectedValue,
      roi,
      compoundedReturn,
      riskAdjustedReturn,
      warnings,
      recommendations
    };
  }

  // Расчет прогнозируемой стоимости
  private static calculateProjectedValue(investment: Investment): number {
    const rate = investment.expectedReturnPercent / 100;
    return investment.initialAmount * Math.pow(1 + rate, investment.timeHorizonYears);
  }

  // Расчет ROI (Return on Investment)
  private static calculateROI(investment: Investment): number {
    const projectedValue = this.calculateProjectedValue(investment);
    return ((projectedValue - investment.initialAmount) / investment.initialAmount) * 100;
  }

  // Расчет доходности с учетом сложного процента
  private static calculateCompoundedReturn(investment: Investment): number {
    const rate = investment.expectedReturnPercent / 100;
    return (Math.pow(1 + rate, investment.timeHorizonYears) - 1) * 100;
  }

  // Расчет доходности с учетом риска (Sharpe Ratio упрощенный)
  private static calculateRiskAdjustedReturn(investment: Investment): number {
    const safeRate = 5; // Безрисковая ставка
    const riskPremium = investment.expectedReturnPercent - safeRate;

    const riskMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 2.0
    };

    const risk = riskMultiplier[investment.riskLevel];
    return riskPremium / risk;
  }

  // Форматированный вывод анализа
  static formatAnalysis(analysis: InvestmentAnalysis, investment: Investment): string {
    let output = '\n=== Инвестиционный анализ ===\n\n';

    output += `💵 Начальная сумма: ${investment.initialAmount.toFixed(2)}\n`;
    if (investment.currentValue) {
      const currentChange = ((investment.currentValue - investment.initialAmount) / investment.initialAmount) * 100;
      output += `📊 Текущая стоимость: ${investment.currentValue.toFixed(2)} (${currentChange > 0 ? '+' : ''}${currentChange.toFixed(2)}%)\n`;
    }
    output += `🎯 Прогноз через ${investment.timeHorizonYears} лет: ${analysis.projectedValue.toFixed(2)}\n`;
    output += `📈 ROI: ${analysis.roi.toFixed(2)}%\n`;
    output += `💹 Доходность (сложный процент): ${analysis.compoundedReturn.toFixed(2)}%\n`;
    output += `⚖️  Риск-скорректированная доходность: ${analysis.riskAdjustedReturn.toFixed(2)}\n`;
    output += `🎲 Уровень риска: ${this.getRiskEmoji(investment.riskLevel)} ${investment.riskLevel}\n\n`;

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

  private static getRiskEmoji(risk: Investment['riskLevel']): string {
    switch (risk) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  }
}
