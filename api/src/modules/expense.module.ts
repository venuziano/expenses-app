import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseController } from 'src/controllers/expense.controller';
import { Expense } from 'src/entities/expense.entity';
import { ExpenseService } from 'src/services/expense.service';
import { CategoryModule } from './category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), CategoryModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
