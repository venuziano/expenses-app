import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { SubscriptionPlan } from 'src/entities/subscription-plan.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Expense } from 'src/entities/expense.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Category, SubscriptionPlan, Subscription, Expense],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
});
