import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateExpenseDto } from 'src/dto/expense/create-expense.dto';
import { UpdateExpenseDto } from 'src/dto/expense/update-expense.dto';
import { CategoryService } from './category.service';
import { ProcessedExpense } from './../interfaces/expense';
import { Expense } from 'src/entities/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const message = createExpenseDto.message;
    const processedMessage = await this.processMessage(message);
    console.log('processedMessage', processedMessage);

    const expenseToCreate: DeepPartial<Expense> = {
      amount: String(processedMessage.amount),
      createdAt: processedMessage.date,
      user: { id: createExpenseDto.userId! },
      category: { id: processedMessage.categoryId },
    };
    await this.expenseRepository.insert(expenseToCreate);

    // split/process message - ok
    /// get category
    /// get amount
    /// get date
    // get user id
    // check if category exists
    /// if category isn't created globally (category.user_id null), create category assinging the user id
    /// if category exists, create the record in the expense table
    return 'Expense created successfully';
  }

  findAll() {
    return `This action returns all expense`;
  }

  findAllByUserId() {
    const userId = 1;
    return (
      this.expenseRepository
        .createQueryBuilder('expense')
        .leftJoin('expense.category', 'category')
        // select all the expense columns you want…
        .addSelect([
          'expense.id',
          'expense.amount',
          'expense.createdAt',
          // … then only the category columns you care about
          'category.id',
          'category.name',
        ])
        .where('expense.user_id = :userId', { userId })
        .orderBy('expense.created_at', 'DESC')
        .getMany()
    );
  }

  findAllByUserEmail(email: string) {
    console.log('email', email);
    return (
      this.expenseRepository
        .createQueryBuilder('expense')
        .leftJoin('expense.category', 'category')
        .leftJoin('expense.user', 'user')
        // select all the expense columns you want…
        .addSelect([
          'expense.id',
          'expense.amount',
          'expense.createdAt',
          // … then only the category columns you care about
          'category.id',
          'category.name',
        ])
        .where('expense.user_id = user.id')
        // .where('expense.user_id = :userId', { userId })
        .andWhere('user.email = :email', { email })
        .orderBy('expense.created_at', 'DESC')
        .getMany()
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }

  async processMessage(message: string): Promise<ProcessedExpense> {
    const lower = message.toLowerCase();
    const amount = this.extractAmount(message);
    const categoryId = await this.identifyCategory(lower);
    const date = this.extractDate(lower);
    return { amount, categoryId, date };
  }

  private extractAmount(message: string): number | null {
    const match = message.match(/r\$\s*([\d.,]+)|([\d.,]+)\s*(?:reais?|pila)/i);
    if (!match) return null;

    const raw = match[1] ?? match[2];
    if (!raw) return null;

    // remove thousands separators and swap comma → dot
    const normalized = raw.replace(/\./g, '').replace(',', '.');

    const n = parseFloat(normalized);
    return isNaN(n) ? null : n;
  }

  private async identifyCategory(lower: string): Promise<number> {
    const categories = await this.categoryService.findAll();
    for (const { id, regex } of categories) {
      // use word-boundaries if you like: new RegExp(`\\b(${regex.join('|')})\\b`)
      if (regex.some((p) => lower.includes(p))) {
        return id;
      }
    }
    return 1;
    // return 'outros';
  }

  private extractDate(lower: string): Date {
    const now = new Date();

    if (/\bhoje\b|\btoday\b/.test(lower)) {
      return now;
    }
    if (/\bontem\b|\byesterday\b/.test(lower)) {
      return subDays(now, 1);
    }
    // dd/mm/yyyy
    const dm = lower.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (dm) {
      const [, dd, mm, yyyy] = dm;
      return new Date(+yyyy, +mm - 1, +dd);
    }

    // fallback
    return now;
  }
}
