import { Injectable } from '@nestjs/common';

import { ExpenseService } from 'src/services/expense.service';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { MessageHandler } from 'src/interfaces/whatsapp-message-handler.interface';
import { CategoryService } from 'src/services/category.service';

@Injectable()
export class SpendQueryHandler implements MessageHandler {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
  ) {}

  canHandle(text: string): boolean {
    return /^quanto eu gastei/i.test(text);
  }

  async handle(text: string, userId: number): Promise<string> {
    // naive parse: category + “hoje” | “ontem” etc.
    const categoryMatch = text.match(/de (\w+)/i);
    const when = /\bhoje\b/i.test(text)
      ? { from: startOfDay(new Date()), to: endOfDay(new Date()) }
      : /\bontem\b/i.test(text)
        ? {
            from: startOfDay(subDays(new Date(), 1)),
            to: endOfDay(subDays(new Date(), 1)),
          }
        : {};
    console.log('categoryMatch', categoryMatch);
    // const category = categoryMatch?.[1] ?? null;
    const category = await this.categoryService.identifyCategory(
      categoryMatch.[1]!,
    );

    const total = await this.expenseService.sumByCategoryAndPeriod(
      userId,
      category,
      when.from,
      when.to,
    );
    return '';
    // return `Você gastou R$ ${total.toFixed(2)} em ${category || 'todas'} ${
    //   when.from ? 'no período solicitado' : ''
    // }.`;
  }
}
