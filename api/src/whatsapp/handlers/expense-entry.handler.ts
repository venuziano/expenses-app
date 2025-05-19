import { Injectable } from '@nestjs/common';

import { MessageHandler } from 'src/interfaces/whatsapp-message-handler.interface';
import { ExpenseService } from 'src/services/expense.service';

@Injectable()
export class ExpenseEntryHandler implements MessageHandler {
  constructor(private readonly expenseService: ExpenseService) {}

  canHandle(text: string): boolean {
    // e.g. “gastei R$ 100 no mercado”
    return /^gastei\b/i.test(text) || /^\d+/.test(text);
  }

  async handle(text: string, userId: number): Promise<string> {
    // reuse your existing parser inside expenseService
    await this.expenseService.create({ message: text, userId });
    return '✅ Expense recorded!';
  }
}
