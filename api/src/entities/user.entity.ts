import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { Category } from './category.entity';
import { Expense } from './expense.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 40 }) username: string;
  @Column({ length: 50 }) firstname: string;
  @Column({ length: 50 }) lastname: string;
  @Column({ length: 50 }) password: string;
  @Column({ length: 255, unique: true }) email: string;
  @Column({ length: 50, nullable: true, name: 'stripe_customer_id' })
  stripeCustomerId?: string;

  @Column({ length: 30, unique: true })
  whatsappNumber: string;

  @OneToMany(() => Subscription, (s) => s.user) subscriptions: Subscription[];
  @OneToMany(() => Category, (c) => c.user) categories: Category[];
  @OneToMany(() => Expense, (e) => e.user) expenses: Expense[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'verified_at' })
  verifiedAt: Date;
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
