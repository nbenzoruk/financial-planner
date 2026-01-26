import { Command } from 'commander';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import { Storage } from '../utils/storage';
import { Investment } from '../models/types';
import { InvestmentAnalyzer } from '../analyzers/investment-analyzer';
import { BiasDetector } from '../analyzers/bias-detector';
import { Validator, ValidationError } from '../utils/validator';

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
      try {
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

        // Валидация
        Validator.validateInvestment(newInvestment);

        // Проверка разумности параметров
        const sanityWarnings = Validator.checkInvestmentSanity(newInvestment);
        if (sanityWarnings.length > 0) {
          console.log(chalk.yellow('\n⚠️  Предупреждения:'));
          sanityWarnings.forEach(w => console.log(chalk.yellow(`  • ${w}`)));
        }

        await Storage.addInvestment(newInvestment);
        console.log(chalk.green(`\n✅ Инвестиция добавлена! ID: ${newInvestment.id}`));

        const data = await Storage.load();
        const analysis = InvestmentAnalyzer.analyze(newInvestment);
        const biasWarnings = BiasDetector.detectForInvestment(newInvestment, data.investments);

        console.log(InvestmentAnalyzer.formatAnalysis(analysis, newInvestment));

        if (biasWarnings.length > 0) {
          console.log(chalk.yellow('🧠 КОГНИТИВНЫЕ ИСКАЖЕНИЯ:\n'));
          biasWarnings.forEach(w => console.log(chalk.yellow(`  ${w}\n`)));
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          console.error(chalk.red(`\n❌ Ошибка валидации: ${error.message}`));
          process.exit(1);
        } else {
          console.error(chalk.red(`\n❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`));
          process.exit(1);
        }
      }
    });

  investment
    .command('analyze <id>')
    .description('Анализ инвестиции по ID')
    .action(async (id) => {
      try {
        const data = await Storage.load();
        const investmentItem = data.investments.find(i => i.id === id);

        if (!investmentItem) {
          console.error(chalk.red('\n❌ Инвестиция не найдена'));
          process.exit(1);
        }

        console.log(chalk.cyan(`\n💰 ${investmentItem.name}`));

        const analysis = InvestmentAnalyzer.analyze(investmentItem);
        const biasWarnings = BiasDetector.detectForInvestment(investmentItem, data.investments);

        console.log(InvestmentAnalyzer.formatAnalysis(analysis, investmentItem));

        if (biasWarnings.length > 0) {
          console.log(chalk.yellow('🧠 КОГНИТИВНЫЕ ИСКАЖЕНИЯ:\n'));
          biasWarnings.forEach(w => console.log(chalk.yellow(`  ${w}\n`)));
        }
      } catch (error) {
        console.error(chalk.red(`\n❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`));
        process.exit(1);
      }
    });

  investment
    .command('list')
    .description('Список всех инвестиций')
    .option('-t, --type <type>', 'Фильтр по типу')
    .action(async (options) => {
      try {
        const data = await Storage.load();
        let investments = data.investments;

        if (options.type) {
          investments = investments.filter(i => i.type === options.type);
        }

        if (investments.length === 0) {
          console.log(chalk.yellow('\n⚠️  Инвестиции не найдены'));
          return;
        }

        console.log(chalk.cyan('\n📊 Список инвестиций:\n'));
        investments.forEach(i => {
          const currentValue = i.currentValue || i.initialAmount;
          const change = ((currentValue - i.initialAmount) / i.initialAmount) * 100;

          console.log(chalk.bold(`[${i.id.substring(0, 8)}] ${i.name}`));
          console.log(`  Тип: ${i.type} | Риск: ${i.riskLevel}`);
          const changeColor = change > 0 ? chalk.green : change < 0 ? chalk.red : chalk.white;
          console.log(`  Начальная сумма: ${i.initialAmount} | Текущая: ${currentValue.toFixed(2)} ${changeColor(`(${change > 0 ? '+' : ''}${change.toFixed(2)}%)`)}`);
          console.log('');
        });
      } catch (error) {
        console.error(chalk.red(`\n❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`));
        process.exit(1);
      }
    });

  return investment;
}
