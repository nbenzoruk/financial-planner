#!/usr/bin/env node

import { Command } from 'commander';
import { createPurchaseCommand } from './commands/purchase';
import { createInvestmentCommand } from './commands/investment';

const program = new Command();

program
  .name('finplan')
  .description('Финансовый планер для рационального принятия решений')
  .version('0.1.0');

program.addCommand(createPurchaseCommand());
program.addCommand(createInvestmentCommand());

program.parse(process.argv);
