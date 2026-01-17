import { Command } from 'commander';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../utils/storage';
import { Purchase } from '../models/types';
import { PurchaseAnalyzer } from '../analyzers/purchase-analyzer';

export function createPurchaseCommand(): Command {
  const purchase = new Command('purchase');

  purchase
    .command('add')
    .description('Добавить покупку')
    .requiredOption('-n, --name <name>', 'Название покупки')
    .requiredOption('-p, --price <price>', 'Цена', parseFloat)
    .requiredOption('-c, --category <category>', 'Категория')
    .option('-l, --lifespan <years>', 'Ожидаемый срок службы в годах', parseFloat)
    .option('-m, --maintenance <cost>', 'Стоимость обслуживания в год', parseFloat)
    .option('-a, --alternative <cost>', 'Альтернативная стоимость', parseFloat)
    .option('-f, --frequency <freq>', 'Частота использования (daily/weekly/monthly/rarely)')
    .option('--notes <notes>', 'Заметки')
    .action(async (options) => {
      const newPurchase: Purchase = {
        id: uuidv4(),
        name: options.name,
        price: options.price,
        category: options.category,
        date: new Date().toISOString(),
        expectedLifespanYears: options.lifespan,
        maintenanceCostPerYear: options.maintenance,
        alternativeCost: options.alternative,
        usageFrequency: options.frequency,
        notes: options.notes
      };

      await Storage.addPurchase(newPurchase);
      console.log(`\n✅ Покупка добавлена! ID: ${newPurchase.id}`);

      const data = await Storage.load();
      const analysis = PurchaseAnalyzer.analyze(newPurchase, data.purchases);
      console.log(PurchaseAnalyzer.formatAnalysis(analysis));
    });

  purchase
    .command('analyze <id>')
    .description('Анализ покупки по ID')
    .action(async (id) => {
      const data = await Storage.load();
      const purchaseItem = data.purchases.find(p => p.id === id);

      if (!purchaseItem) {
        console.error('Покупка не найдена');
        return;
      }

      console.log(`\n📦 ${purchaseItem.name}`);
      console.log(`Цена: ${purchaseItem.price}`);
      console.log(`Категория: ${purchaseItem.category}`);

      const analysis = PurchaseAnalyzer.analyze(purchaseItem, data.purchases);
      console.log(PurchaseAnalyzer.formatAnalysis(analysis));
    });

  purchase
    .command('list')
    .description('Список всех покупок')
    .option('-c, --category <category>', 'Фильтр по категории')
    .action(async (options) => {
      const data = await Storage.load();
      let purchases = data.purchases;

      if (options.category) {
        purchases = purchases.filter(p => p.category === options.category);
      }

      if (purchases.length === 0) {
        console.log('Покупки не найдены');
        return;
      }

      console.log('\n📋 Список покупок:\n');
      purchases.forEach(p => {
        console.log(`[${p.id.substring(0, 8)}] ${p.name}`);
        console.log(`  Цена: ${p.price} | Категория: ${p.category} | Дата: ${new Date(p.date).toLocaleDateString()}`);
        console.log('');
      });
    });

  return purchase;
}
