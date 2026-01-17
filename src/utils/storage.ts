import * as fs from 'fs/promises';
import * as path from 'path';
import { FinancialData, Purchase, Investment } from '../models/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'financial-data.json');

// Инициализация пустых данных
const emptyData: FinancialData = {
  purchases: [],
  investments: [],
  lastUpdated: new Date().toISOString()
};

export class Storage {
  // Загрузка данных из JSON файла
  static async load(): Promise<FinancialData> {
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(content) as FinancialData;
    } catch (error) {
      // Если файла нет, создаем новый
      await this.ensureDataDir();
      await this.save(emptyData);
      return emptyData;
    }
  }

  // Сохранение данных в JSON файл
  static async save(data: FinancialData): Promise<void> {
    await this.ensureDataDir();
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Создание директории data если её нет
  private static async ensureDataDir(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  // Добавление покупки
  static async addPurchase(purchase: Purchase): Promise<void> {
    const data = await this.load();
    data.purchases.push(purchase);
    await this.save(data);
  }

  // Добавление инвестиции
  static async addInvestment(investment: Investment): Promise<void> {
    const data = await this.load();
    data.investments.push(investment);
    await this.save(data);
  }

  // Получение покупки по ID
  static async getPurchase(id: string): Promise<Purchase | undefined> {
    const data = await this.load();
    return data.purchases.find(p => p.id === id);
  }

  // Получение инвестиции по ID
  static async getInvestment(id: string): Promise<Investment | undefined> {
    const data = await this.load();
    return data.investments.find(i => i.id === id);
  }

  // Обновление покупки
  static async updatePurchase(id: string, updates: Partial<Purchase>): Promise<void> {
    const data = await this.load();
    const index = data.purchases.findIndex(p => p.id === id);
    if (index !== -1) {
      data.purchases[index] = { ...data.purchases[index], ...updates };
      await this.save(data);
    }
  }

  // Удаление покупки
  static async deletePurchase(id: string): Promise<void> {
    const data = await this.load();
    data.purchases = data.purchases.filter(p => p.id !== id);
    await this.save(data);
  }
}
