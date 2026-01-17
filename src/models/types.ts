// Основные типы данных для финансового планера

export interface Purchase {
  id: string;
  name: string;
  price: number;
  date: string;
  category: string;
  // Для анализа рентабельности
  expectedLifespanYears?: number; // Ожидаемый срок службы
  maintenanceCostPerYear?: number; // Стоимость обслуживания в год
  alternativeCost?: number; // Альтернативная стоимость (если бы не купили)
  usageFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely'; // Частота использования
  notes?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'real-estate' | 'crypto' | 'business' | 'other';
  initialAmount: number;
  currentValue?: number;
  date: string;
  expectedReturnPercent: number; // Ожидаемая доходность в год
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizonYears: number; // Срок инвестиции
  notes?: string;
}

export interface CognitiveBias {
  type: 'sunk-cost' | 'lifestyle-creep' | 'anchoring' | 'recency' | 'loss-aversion';
  description: string;
  detectionRules: string[];
}

// Результаты анализа покупки
export interface PurchaseAnalysis {
  purchaseId: string;
  costPerUse: number; // Стоимость одного использования
  totalCostOfOwnership: number; // Полная стоимость владения за срок службы
  dailyEquivalent: number; // Сколько стоит в день
  warnings: string[]; // Предупреждения о возможных когнитивных искажениях
  recommendations: string[];
}

// Результаты инвестиционного анализа
export interface InvestmentAnalysis {
  investmentId: string;
  projectedValue: number; // Прогнозируемая стоимость
  roi: number; // Return on Investment в процентах
  compoundedReturn: number; // С учетом сложного процента
  riskAdjustedReturn: number; // С учетом риска
  warnings: string[];
  recommendations: string[];
}

// Хранилище данных
export interface FinancialData {
  purchases: Purchase[];
  investments: Investment[];
  lastUpdated: string;
}
