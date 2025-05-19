import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => Category, (c) => c.expenses)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, (u) => u.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { precision: 19, scale: 4 }) amount: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
