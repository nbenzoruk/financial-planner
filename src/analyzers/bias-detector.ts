import { Purchase, Investment } from '../models/types';

export class BiasDetector {
  // Детекция когнитивных искажений для покупок
  static detectForPurchase(purchase: Purchase, allPurchases: Purchase[]): string[] {
    const warnings: string[] = [];

    // 1. Sunk Cost Fallacy (Ошибка невозвратных затрат)
    if (this.detectSunkCost(purchase, allPurchases)) {
      warnings.push('🧠 SUNK COST FALLACY: Обнаружены предыдущие траты в той же категории. Не позволяйте прошлым затратам влиять на текущее решение.');
    }

    // 2. Lifestyle Creep (Расползание образа жизни)
    if (this.detectLifestyleCreep(purchase, allPurchases)) {
      warnings.push('🧠 LIFESTYLE CREEP: Рост расходов в категории. Убедитесь, что это осознанное решение, а не автоматическое повышение стандартов.');
    }

    // 3. Anchoring Bias (Эффект якоря)
    if (this.detectAnchoring(purchase)) {
      warnings.push('🧠 ANCHORING: Цена кажется высокой. Сравните с реальной ценностью, а не только с первоначальной ценой или скидкой.');
    }

    // 4. Recency Bias (Эффект недавности)
    if (this.detectRecency(purchase, allPurchases)) {
      warnings.push('🧠 RECENCY BIAS: Частые покупки в последнее время. Возможно, вы реагируете на краткосрочные стимулы, а не на реальную потребность.');
    }

    // 5. Loss Aversion (Неприятие потерь)
    if (this.detectLossAversion(purchase)) {
      warnings.push('🧠 LOSS AVERSION: Покупка может быть попыткой избежать потенциальных потерь. Оцените реальную вероятность этих потерь.');
    }

    return warnings;
  }

  // Детекция ошибки невозвратных затрат
  private static detectSunkCost(purchase: Purchase, allPurchases: Purchase[]): boolean {
    const sameCategoryPurchases = allPurchases.filter(
      p => p.category === purchase.category && p.id !== purchase.id
    );

    if (sameCategoryPurchases.length === 0) return false;

    const recentPurchases = sameCategoryPurchases.filter(p => {
      const daysSince = this.daysBetween(new Date(p.date), new Date());
      return daysSince < 180; // Последние 6 месяцев
    });

    return recentPurchases.length >= 2;
  }

  // Детекция расползания образа жизни
  private static detectLifestyleCreep(purchase: Purchase, allPurchases: Purchase[]): boolean {
    const sameCategoryPurchases = allPurchases
      .filter(p => p.category === purchase.category)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sameCategoryPurchases.length < 2) return false;

    const avgPreviousPrice = sameCategoryPurchases.reduce((sum, p) => sum + p.price, 0) / sameCategoryPurchases.length;

    return purchase.price > avgPreviousPrice * 1.5;
  }

  // Детекция эффекта якоря
  private static detectAnchoring(purchase: Purchase): boolean {
    if (!purchase.alternativeCost) return false;

    return purchase.price > purchase.alternativeCost * 1.3;
  }

  // Детекция эффекта недавности
  private static detectRecency(purchase: Purchase, allPurchases: Purchase[]): boolean {
    const recentPurchases = allPurchases.filter(p => {
      const daysSince = this.daysBetween(new Date(p.date), new Date());
      return daysSince < 30;
    });

    return recentPurchases.length >= 5;
  }

  // Детекция неприятия потерь
  private static detectLossAversion(purchase: Purchase): boolean {
    const lossAversionKeywords = ['страховка', 'защита', 'гарантия', 'резервный', 'backup'];
    const purchaseName = purchase.name.toLowerCase();

    return lossAversionKeywords.some(keyword => purchaseName.includes(keyword)) &&
           purchase.price > 500;
  }

  // Вспомогательная функция для расчета дней между датами
  private static daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  }

  // Детекция когнитивных искажений для инвестиций
  static detectForInvestment(investment: Investment, allInvestments: Investment[]): string[] {
    const warnings: string[] = [];

    // FOMO (Fear of Missing Out)
    if (this.detectFOMO(investment)) {
      warnings.push('🧠 FOMO: Высокая ожидаемая доходность при высоком риске. Убедитесь, что это не страх упустить возможность.');
    }

    // Confirmation Bias
    if (investment.riskLevel === 'high' && investment.expectedReturnPercent > 30) {
      warnings.push('🧠 CONFIRMATION BIAS: Чрезмерно оптимистичные прогнозы. Рассмотрите также пессимистичные сценарии.');
    }

    // Overconfidence
    if (this.detectOverconfidence(investment, allInvestments)) {
      warnings.push('🧠 OVERCONFIDENCE: Множество высокорисковых инвестиций. Возможна переоценка своих способностей к прогнозированию.');
    }

    return warnings;
  }

  private static detectFOMO(investment: Investment): boolean {
    return investment.riskLevel === 'high' &&
           investment.expectedReturnPercent > 50 &&
           investment.timeHorizonYears < 3;
  }

  private static detectOverconfidence(investment: Investment, allInvestments: Investment[]): boolean {
    const highRiskInvestments = allInvestments.filter(i => i.riskLevel === 'high');
    const totalInvestmentAmount = allInvestments.reduce((sum, i) => sum + i.initialAmount, 0);
    const highRiskAmount = highRiskInvestments.reduce((sum, i) => sum + i.initialAmount, 0);

    return totalInvestmentAmount > 0 && (highRiskAmount / totalInvestmentAmount) > 0.4;
  }
}
