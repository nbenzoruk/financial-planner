import { Command } from 'commander';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../utils/storage';
import { Investment } from '../models/types';
import { InvestmentAnalyzer } from '../analyzers/investment-analyzer';
import { BiasDetector } from '../analyzers/bias-detector';

export function createInvestmentCommand(): Command {
  const investment = new Command('investment');

  investment
    .command('add')
    .description('Добавить инвестицию')
    .requiredOption('-n, --name <name>', 'Название инвестиции')
    .requiredOption('-a, --amount <amount>', 'Начальная сумма', parseFloat)
    .requiredOption('-t, --type <type>', 'Тип (stocks/bonds/real-estate/crypto/business/other)')
    .requiredOption('-r, --return <percent>', 'Ожидаемая доходность в год (%)', parseFloat)
    .requiredOption('--risk <level>', 'Уровень риска (low/medium/high)')
    .requiredOption('--horizon <years>', 'Срок инвестиции в годах', parseFloat)
    .option('-c, --current <value>', 'Текущая стоимость', parseFloat)
    .option('--notes <notes>', 'Заметки')
    .action(async (options) => {
      const newInvestment: Investment = {
        id: uuidv4(),
        name: options.name,
        initialAmount: options.amount,
        type: options.type,
        expectedReturnPercent: options.return,
        riskLevel: options.risk,
        timeHorizonYears: options.horizon,
        currentValue: options.current,
        date: new Date().toISOString(),
        notes: options.notes
      };

      await Storage.addInvestment(newInvestment);
      console.log(`\n✅ Инвестиция добавлена! ID: ${newInvestment.id}`);

      const data = await Storage.load();
      const analysis = InvestmentAnalyzer.analyze(newInvestment);
      const biasWarnings = BiasDetector.detectForInvestment(newInvestment, data.investments);

      console.log(InvestmentAnalyzer.formatAnalysis(analysis, newInvestment));

      if (biasWarnings.length > 0) {
        console.log('🧠 КОГНИТИВНЫЕ ИСКАЖЕНИЯ:\n');
        biasWarnings.forEach(w => console.log(`  ${w}\n`));
      }
    });

  investment
    .command('analyze <id>')
    .description('Анализ инвестиции по ID')
    .action(async (id) => {
      const data = await Storage.load();
      const investmentItem = data.investments.find(i => i.id === id);

      if (!investmentItem) {
        console.error('Инвестиция не найдена');
        return;
      }

      console.log(`\n💰 ${investmentItem.name}`);

      const analysis = InvestmentAnalyzer.analyze(investmentItem);
      const biasWarnings = BiasDetector.detectForInvestment(investmentItem, data.investments);

      console.log(InvestmentAnalyzer.formatAnalysis(analysis, investmentItem));

      if (biasWarnings.length > 0) {
        console.log('🧠 КОГНИТИВНЫЕ ИСКАЖЕНИЯ:\n');
        biasWarnings.forEach(w => console.log(`  ${w}\n`));
      }
    });

  investment
    .command('list')
    .description('Список всех инвестиций')
    .option('-t, --type <type>', 'Фильтр по типу')
    .action(async (options) => {
      const data = await Storage.load();
      let investments = data.investments;

      if (options.type) {
        investments = investments.filter(i => i.type === options.type);
      }

      if (investments.length === 0) {
        console.log('Инвестиции не найдены');
        return;
      }

      console.log('\n📊 Список инвестиций:\n');
      investments.forEach(i => {
        const currentValue = i.currentValue || i.initialAmount;
        const change = ((currentValue - i.initialAmount) / i.initialAmount) * 100;

        console.log(`[${i.id.substring(0, 8)}] ${i.name}`);
        console.log(`  Тип: ${i.type} | Риск: ${i.riskLevel}`);
        console.log(`  Начальная сумма: ${i.initialAmount} | Текущая: ${currentValue.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
        console.log('');
      });
    });

  return investment;
}
